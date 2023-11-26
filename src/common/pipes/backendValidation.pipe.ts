//? So what is pipe ?
//* -> this is simply a class that implements something in the same way, like a decorator or a middlware.

import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform, ValidationError } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class BackendValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const object = plainToClass(metadata.metatype, value) //* we want to convert our metadata with value to an object
        const errors = await validate(object);

        if (errors.length === 0) {
            //* if we validate our object and don't have any errors, then we just skip this validation pipe, this means that everything is fine
            return value;
        }

        throw new HttpException({errors: this.formatErrors(errors)}, HttpStatus.UNPROCESSABLE_ENTITY);
     }

     formatErrors (errors: ValidationError[] ) {
        return errors.reduce((acc, error)=> {
             acc[error.property] = Object.values(error.constraints);
             return acc;
        }, {})
     }
}