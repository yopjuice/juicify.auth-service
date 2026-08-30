import { AsyncLocalStorage } from 'async_hooks';

export class TraceContextStorage {
  private static readonly storage = new AsyncLocalStorage<Map<string, string>>();

  static run(correlationId: string, callback: () => void) {
    const store = new Map<string, string>();
    store.set('correlationId', correlationId);
    this.storage.run(store, callback);
  }

  static getCorrelationId(): string | undefined {
    return this.storage.getStore()?.get('correlationId');
  }
}
