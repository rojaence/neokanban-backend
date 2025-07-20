import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpResponse } from '@src/common/helpers/http-response';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import { PrismaService } from '@src/database/prisma/prisma.service';
import { BaseUnitTestModule } from '../../../../../test/unit/unit-test.module';
import { AuthRepository } from '../../repositories/auth.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        BcryptService,
        HttpResponse,
        PrismaService,
        {
          provide: AuthRepository,
          useValue: {
            findUserByUsername: jest.fn().mockResolvedValue({
              id: 'user-id',
              username: 'testuser',
              password: 'hashed-password',
            }),
          },
        },
      ],
      imports: [BaseUnitTestModule.forRoot()],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
