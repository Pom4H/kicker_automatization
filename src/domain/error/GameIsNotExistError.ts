import { SerializableError } from '@error';

class GameIsNotExistError extends SerializableError {
  protected code: string;

  constructor(message: string) {
    super(message);
    this.code = 'GameIsNotExistError';
  }
}

export { GameIsNotExistError };
