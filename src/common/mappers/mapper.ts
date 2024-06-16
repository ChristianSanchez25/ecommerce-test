import { plainToInstance } from 'class-transformer';

export class Mapper {
  static entityToDto<T, U>(entity: T, dtoClass: new () => U): U {
    return plainToInstance(dtoClass, entity);
  }

  static dtoToEntity<T, U>(dto: T, entityClass: new () => U): U {
    return plainToInstance(entityClass, dto);
  }

  static schemaToEntity<T, U>(schema: T, entityClass: new () => U): U {
    return plainToInstance(entityClass, schema);
  }

  static entityToSchema<T, U>(entity: T, schemaClass: new () => U): U {
    return plainToInstance(schemaClass, entity);
  }
}
