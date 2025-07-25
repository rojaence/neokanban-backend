import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@src/database/prisma/prisma.service';
import { BaseUnitTestModule } from '../../../../common/test/unit/unit-test.module';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import { CommonModule } from '@src/common/common.module';
import { MockPrismaService } from '@src/database/mocks/prismaClient/mockPrisma.service';
import { AuthRepository } from '../../repositories/auth.repository';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import { JwtService } from '../jwt/jwt.service';

describe('AuthService', () => {
  let service: AuthService;
  let translationService: TranslationService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        BcryptService,
        JwtService,
        TranslationService,
        AuthRepository,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
      imports: [BaseUnitTestModule.forRoot(), CommonModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
    translationService = module.get<TranslationService>(TranslationService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate token to valid credentials', async () => {
    const credentials = { username: 'testuser', password: '12345' };
    const response = await service.login(credentials);
    expect(response).toBeDefined();
  });

  it('should handle error to user not found', async () => {
    const credentials = { username: 'noexistsuser', password: '12345' };
    const loginFunction = async () => await service.login(credentials);
    const errorMessage = translationService.t('auth.userNotFound') as string;
    await expect(loginFunction).rejects.toThrow(errorMessage);
  });

  it('should handle error to invalid password', async () => {
    const credentials = { username: 'testuser', password: 'invalid' };
    const loginFunction = async () => await service.login(credentials);
    const errorMessage = translationService.t(
      'auth.invalidCredentials',
    ) as string;
    await expect(loginFunction).rejects.toThrow(errorMessage);
  });

  it('should return a valid token with valid login', async () => {
    const credentials = { username: 'testuser', password: '12345' };
    const token = await service.login(credentials);
    const decoded = jwtService.verifyToken(token);
    expect(typeof token).toBe('string');
    expect(decoded.valid).toBe(true);
  });
});
