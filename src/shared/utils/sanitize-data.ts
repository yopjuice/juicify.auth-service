// Makes sure that sensitive data is not logged
export function sanitizeData(data: any): any {
  if (!data || typeof data !== 'object') return data;

  // Create a copy of the object
  const cloned = { ...data };
  const sensitiveFields = ['password', 'token', 'accessToken', 'secret', 'card'];

  for (const key in cloned) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      cloned[key] = '[REDACTED]';
    } else if (typeof cloned[key] === 'object') {
      cloned[key] = sanitizeData(cloned[key]);
    }
  }
  return cloned;
}
