import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Newable } from './Newable';

export abstract class Config {
  public validate(): void | never {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error(
        `Validation failed for config ${this.getName()}, errors: ${JSON.stringify(errors)}`,
      );
    }
  }

  public abstract getName(): string;

  public getDefaults(): Object {
    return {};
  }

  protected validateNested(target: object, targetConstructor: Newable<any>): void | never {
    const instance = plainToClass(targetConstructor, target);
    const errors = validateSync(instance);
    if (errors.length) {
      throw new Error(
        `Validation failed for config ${this.getName()}, errors: ${JSON.stringify(errors)}`,
      );
    }
  }
}
