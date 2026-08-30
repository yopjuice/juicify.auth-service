import * as fs from 'fs';
import * as path from 'path';

// Cache for used queries
const queriesCache = new Map<string, string>();

export function loadSql(entityName: string, fileName: string): string {
  const cacheKey = `${entityName}/${fileName}`;

  if (queriesCache.has(cacheKey)) {
    return queriesCache.get(cacheKey)!;
  }

  // Building path: sql/queries/<entityName>/<fileName>
  const filePath = path.join(
    process.cwd(),
    'sql/queries',
    entityName,
    fileName,
  );
  const sql = fs.readFileSync(filePath, 'utf-8');

  // Add to cache
  queriesCache.set(cacheKey, sql);
  return sql;
}
