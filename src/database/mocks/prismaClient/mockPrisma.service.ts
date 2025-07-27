import { Injectable } from '@nestjs/common';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import environment from '@src/environment/environment';

@Injectable()
export class MockPrismaService {
  user: any;
  $queryRaw: any;

  constructor(private bcryptService: BcryptService) {
    this.initializeMockUser();
    this.initializeQueryRaw();
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
              email: 'testuser@example.com',
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

  private initializeQueryRaw() {
    this.$queryRaw = jest.fn((strings: TemplateStringsArray) => {
      const query = strings.join('').trim().toLowerCase();

      if (query === 'select now()') {
        const date = Date.now();
        return Promise.resolve([{ now: date.toLocaleString() }]);
      }

      return Promise.resolve([]);
    });
  }
}
