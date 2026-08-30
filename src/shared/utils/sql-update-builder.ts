import { caseTransformer } from './case-transformer';
import {Logger} from '@nestjs/common';

interface UpdateParams {
  table: string;
  data: Record<string, any>;
  where: Record<string, any>;
}

// Funciton for writing custom sql queries depending on the data and where clauses
export function buildUpdateQuery({ table, data, where }: UpdateParams): {
  query: string;
  values: any[];
} {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;
  
  const logger = new Logger(buildUpdateQuery.name);

  // Building SET clause
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      const dbField = caseTransformer.camelToSnake(key);
      updates.push(`${dbField} = $${paramCount++}`);
      values.push(value);
    }
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  // Adding updated_at field
  updates.push('updated_at = NOW()');

  // building WHERE clause
  const whereClauses: string[] = [];
  for (const [key, value] of Object.entries(where)) {
    whereClauses.push(`${key} = $${paramCount++}`);
    values.push(value);
  }

  // Putting it all together
  const query = `
    UPDATE ${table}
    SET ${updates.join(', ')}
    WHERE ${whereClauses.join(' AND ')}
    RETURNING *
  `;
  logger.log({ data, where, query });

  return { query, values };
}
