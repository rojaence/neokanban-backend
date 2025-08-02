import { Injectable } from '@nestjs/common';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import { fakeAdminUser } from '@src/test/fakes/user';

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
          if (args.where.username === fakeAdminUser.username) {
            return fakeAdminUser;
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
