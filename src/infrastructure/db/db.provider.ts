import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Pool, QueryResultRow, PoolClient } from 'pg';
import { MyConfigService } from '../../config/config.service';
import { Logger } from '@nestjs/common';

// Interface for PgtypedQuery generated functions
interface PgtypedQuery<TParams, TResult> {
  run: (params: TParams, db: Pool | PoolClient) => Promise<TResult[]>;
}


@Injectable()
export class DatabaseProvider implements OnApplicationShutdown {
  private readonly pool: Pool;
  private readonly logger = new Logger(DatabaseProvider.name);

  constructor(private readonly config: MyConfigService) {
    this.pool = new Pool({
      connectionString: this.config.get('database.url'),
      max: 20, // Max number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Connection timeout of 2 seconds
    });

    // Log errors
    this.pool.on('error', (err) => {
      this.logger.error('Unexpected error on idle pg client', err);
      // TODO: change to NestJS logger
    });
  }

  public async run<TParams, TResult extends QueryResultRow>(
    query: PgtypedQuery<TParams, TResult>,
    params: TParams = {} as any,
    txClient?: PoolClient, // pass transaction client to run query in transaction
  ): Promise<TResult[]> {
    const start = Date.now();
    // Choose between transaction and connection pool
    const dbTarget = txClient || this.pool;

    try {
      const rows = await query.run(params, dbTarget);
      const duration = Date.now() - start;

      if (duration > 100) {
        this.logger.log(`[Slow Pgtyped Query] ${duration}ms`);
      }

      return rows;
    } catch (error) {
      this.logger.error(`[DB Pgtyped Error]`, error);
      throw error;
    }
  }

  public async runOne<TParams, TResult extends QueryResultRow>(
    query: PgtypedQuery<TParams, TResult>,
    params: TParams = {} as any,
    txClient?: PoolClient,
  ): Promise<TResult | null> {
    const rows = await this.run<TParams, TResult>(query, params, txClient);
    return rows[0] || null;
  }

  public async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<T[]> {
    const start = Date.now();
    try {
      const res = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;

      if (duration > 100) {
        this.logger.log(`[Slow Query] ${duration}ms: ${text.substring(0, 50)}...`);
      }

      return res.rows;
    } catch (error) {
      this.logger.error(`[DB Query Error] ${text}`, error);
      throw error;
    }
  }

  // Close connection pool on shutdown
  public async onApplicationShutdown(): Promise<void> {
    this.logger.log('Closing database connection pool...');
    await this.pool.end();
  }

  public async queryOne<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<T | null> {
    const res = await this.query<T>(text, params);
    return res[0] || null;
  }

  public async runInTransaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
