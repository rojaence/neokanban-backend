import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
  async genPasswordHash(
    password: string,
    saltRounds: number = 10,
  ): Promise<string> {
    return await hash(password, saltRounds);
  }

  async chechPasswordHash(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
