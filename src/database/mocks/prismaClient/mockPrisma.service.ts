import { Injectable } from '@nestjs/common';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import environment from '@src/environment/environment.test';

@Injectable()
export class MockPrismaService {
  user: any;

  constructor(private bcryptService: BcryptService) {
    this.initializeMockUser();
  }

  private initializeMockUser() {
    this.user = {
      findUnique: jest
        .fn()
        .mockImplementation((args: { where: { username: string } }) => {
          if (args.where.username === 'testuser') {
            return {
              id: 1,
              username: 'testuser',
              password: environment.USER_DEFAULT_PASSWORD_HASH,
            };
          }
          return null;
        }),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }
}
