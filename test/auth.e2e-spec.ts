import { Test, TestingModule } from '@nestjs/testing';
import '@grpc/proto-loader';
import '@grpc/grpc-js'
import { GrpcValidationPipe } from '../src/infrastructure/grpc/grpc.validation-pipe';
import { GlobalGrpcExceptionFilter } from '../src/infrastructure/grpc/grpc.filter';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module';
import { AuthServiceClient } from '@juice11-micro/contracts';
import {
  grpcPackages,
  grpcProtoPaths,
} from '../src/infrastructure/grpc/gprc.options';
import { MyConfigService } from '../src/config/config.service';
import { DatabaseProvider } from '../src/infrastructure/db/db.provider';
import { GrpcToPromise } from '../src/shared/types';
import { AuthGrpc } from '../src/infrastructure/auth/auth.client';
import { TokenRepo } from '../src/infrastructure/token/token.repo';
import { UserRepo } from '../src/infrastructure/user/user.repo';
import { AuthFixtures } from '../src/modules/auth/fixtures/auth.fixtures';
import { UserFixtures } from '../src/modules/user/fixtures/user.fixture';
import { TokenFixtures } from '../src/modules/token/fixtures/token.fixture';
import getFreePort from 'get-port';

// TODO: add separate database for testing
// TODO: add more scenarios
describe('Auth gRPC (e2e)', () => {
  let app: INestMicroservice;
  let wrapper: AuthGrpc;
  let client: GrpcToPromise<AuthServiceClient>;
  let db: DatabaseProvider;
  let tokenRepo: TokenRepo;
  let userRepo: UserRepo;

  beforeAll(async () => {
    
    // use any free port for testing
    const testPort = await getFreePort();
    process.env.GRPC_PORT = testPort.toString();

    // Create testing module with all dependencies
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const config = moduleFixture.get<MyConfigService>(MyConfigService);
    const port = config.get('grpc.port');

    const protoOptions = {
      transport: Transport.GRPC as const,
      options: {
        url: `localhost:${port}`,
        package: grpcPackages,
        protoPath: grpcProtoPaths,
      },
    };

    // init app as microservice
    app = moduleFixture.createNestMicroservice(protoOptions);
    app.useGlobalPipes(new GrpcValidationPipe());
    app.useGlobalFilters(new GlobalGrpcExceptionFilter());
    await app.listen();

    wrapper = moduleFixture.get<AuthGrpc>(AuthGrpc);
    client = wrapper.client;

    db = moduleFixture.get<DatabaseProvider>(DatabaseProvider);
    userRepo = moduleFixture.get<UserRepo>(UserRepo);
    tokenRepo = moduleFixture.get<TokenRepo>(TokenRepo);
  });

  afterEach(async () => {
    // Clear database to avoid conflicts
    await db.query('TRUNCATE TABLE tokens CASCADE;');
    await db.query('TRUNCATE TABLE users CASCADE;');

  });

  afterAll(async () => {
    await app.close();
  });

  describe('regiter()', () => {
    it('should return tokens for newly created user', async () => {
      const dto = AuthFixtures.registerDto();
      const result = await client.register({ ...dto });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('login()', () => {
    it('should return tokens for existing user', async () => {
      const dto = AuthFixtures.registerDto();
      await client.register({ ...dto });

      const result = await client.login({ ...dto });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('refreshTokens()', () => {
    it('should return tokens for existing user', async () => {
      const dto = AuthFixtures.registerDto();
      const { refreshToken } = await client.register({ ...dto });

      const result = await client.refreshTokens({ refreshToken });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('logout()', () => {
    it('should return tokens for existing user', async () => {
      const dto = AuthFixtures.registerDto();
      const { refreshToken } = await client.register({ ...dto });

      const result = await client.logout({ refreshToken });

      expect(result).toEqual({});
    });
  });

  describe('Invalid credentials errors', () => {
    it.each([
      {
        method: 'login',
        call: () => {
          const user = UserFixtures.entity();
          return client.login({ email: user.email, password: UserFixtures.password() })
        }
      },
      {
        method: 'refreshTokens',
        call: () => {
          return client.refreshTokens({ refreshToken: TokenFixtures.tokens().refreshToken })
        }
      },
    ])(
      'should return gRPC Unauthenticated error when $method target does not exist',
      async ({ call }) => {
        await expect(call()).rejects.toMatchObject({
          code: 13,
          details: expect.stringContaining('Invalid'),
        });
      },
    );
  });

  describe('Validation errors', () => {
    it.each([
      {
        method: 'register',
        field: 'email',
        call: () => {
          const dto = AuthFixtures.registerDto({ email: 'invalid-email' });
          return client.register({ ...dto });
        }
      },
      {
        method: 'login',
        field: 'email',
        call: () => {
          const dto = AuthFixtures.loginDto({ email: 'invalid-email' });
          return client.login({ ...dto });
        }
      },
      {
        method: 'refresh',
        field: 'token',
        call: () => {
          const dto = AuthFixtures.refreshDto({ refreshToken: 'invalid-token' });
          return client.refreshTokens({ ...dto });
        }
      },
      {
        method: 'logout',
        field: 'token',
        call: () => {
          const dto = AuthFixtures.refreshDto({ refreshToken: 'invalid-token' });
          return client.logout({ ...dto });
        }
      },
    ])(
      'should return gRPC INVALID_ARGUMENT error when $method params are invalid',
      async ({ call, field }) => {
        await expect(call()).rejects.toMatchObject({
          code: 13,
          details: expect.stringContaining(field),
        });
      },
    );
  });
});
