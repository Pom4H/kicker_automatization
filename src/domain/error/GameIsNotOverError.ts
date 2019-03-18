import { SerializableError } from '@error';

class GameIsNotOverError extends SerializableError {
  protected code: string;

  constructor(message: string) {
    super(message);
    this.code = 'PreviousGameIsNotOver';
  }
}

export { GameIsNotOverError };
