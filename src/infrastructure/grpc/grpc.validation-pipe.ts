import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {Logger} from '@nestjs/common';
import { InvalidArgumentError } from '../../shared/errors/domain-errors';

@Injectable()
export class GrpcValidationPipe implements PipeTransform<any> {

  private readonly logger = new Logger(GrpcValidationPipe.name);

  async transform(value: any, { metatype }: ArgumentMetadata) {
    // Skip validation if there's no DTO metatype assigned to the payload
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert the plain JavaScript object from gRPC into a class instance
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      // Format error messages nicely
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('; ');

      this.logger.log(errorMessages);

      throw new InvalidArgumentError(errorMessages);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
