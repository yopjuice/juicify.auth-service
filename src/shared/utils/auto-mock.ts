import { Mock } from 'vitest';

export type MockedClass<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any 
    ? Mock<T[K]> 
    : T[K];
};

export const createAutoMock = <T>(ClassTarget: new (...args: any[]) => T): MockedClass<T> => {
  const mock: any = {};
  
  const methods = Object.getOwnPropertyNames(ClassTarget.prototype).filter(
    (method) => method !== 'constructor' && typeof ClassTarget.prototype[method] === 'function'
  );

  methods.forEach((method) => {
    mock[method] = vi.fn();
  });

  return mock as MockedClass<T>;
};
