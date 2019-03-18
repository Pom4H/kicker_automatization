import { SerializableError } from '@error';

class GameIsAlreadyExistError extends SerializableError {
  protected code: string;

  constructor(message: string) {
    super(message);
    this.code = 'GameIsAlreadyExistError';
  }
}

export { GameIsAlreadyExistError };
