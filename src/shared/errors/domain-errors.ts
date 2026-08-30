// Only these errors are allowed to be thrown by domain logic

export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly type = 'domain';

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    this.code = this.constructor.name
      .replace(/Error$/, '')
      .replace(/([A-Z])/g, '_$1')
      .toUpperCase()
      .replace(/^_/, '');
  }
}

// Implementations of domain errors

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string) {
    const capitalized =
      entityName.charAt(0).toUpperCase() + entityName.slice(1);
    super(`${capitalized} not found`);
  }
}

export class EntityAlreadyExistsError extends DomainError {
  constructor(entityName: string) {
    const capitalized =
      entityName.charAt(0).toUpperCase() + entityName.slice(1);
    super(`${capitalized} already exists`);
  }
}

export class InvalidArgumentError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthenticatedError extends DomainError {
  constructor(message = 'Authentication required') {
    super(message);
  }
}

export class PermissionDeniedError extends DomainError {
  constructor(message = 'Permission denied') {
    super(message);
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class ResourceExhaustedError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends DomainError {}
