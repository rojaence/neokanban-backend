import { TranslationService } from '@src/common/helpers/i18n-translation';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@src/modules/auth/services/jwt/jwt.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseUnitTestModule } from '@src/common/test/unit/unit-test.module';
import { UnitTestUtils } from '@src/common/test/unit/unit-test.utils';
import { fakeAdminUser } from '@src/test/fakes/user';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let translation: TranslationService;
  let jwt: JwtService;
  const userData = fakeAdminUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BaseUnitTestModule.forRoot()],
    }).compile();

    translation = module.get<TranslationService>(TranslationService);
    jwt = module.get<JwtService>(JwtService);
    authGuard = new AuthGuard(jwt, translation);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should return true if valid credentials', () => {
    const token = jwt.generateToken({
      roleId: 1,
      username: userData.username,
      userId: userData.id,
    });
    const context = UnitTestUtils.createMockContext(token);
    const valid = authGuard.canActivate(context);
    expect(valid).toBe(true);
  });

  it('should return false with invalid credentials', async () => {
    const context = UnitTestUtils.createMockContext();
    const loginFunction = async () => await authGuard.canActivate(context);
    const errorMessage = translation.t('auth.invalidCredentials') as string;
    await expect(loginFunction).rejects.toThrow(errorMessage);
  });

  it('should return false with invalid credentials (invalid jwt)', async () => {
    const context = UnitTestUtils.createMockContext('invalidjwttoken');
    const loginFunction = async () => await authGuard.canActivate(context);
    const errorMessage = translation.t('auth.invalidCredentials') as string;
    await expect(loginFunction).rejects.toThrow(errorMessage);
  });

  it('should return false with invalid credentials (expired jwt)', async () => {
    const token = jwt.generateToken(
      {
        roleId: 1,
        username: userData.username,
        userId: userData.id,
      },
      { expiresIn: 1 },
    );
    const context = UnitTestUtils.createMockContext(token);
    await UnitTestUtils.sleepTest(2000);
    const loginFunction = async () => {
      return await authGuard.canActivate(context);
    };
    const errorMessage = translation.t('auth.invalidCredentials') as string;
    await expect(loginFunction).rejects.toThrow(errorMessage);
  });

  it('should return true with valid alternative header authorization', () => {
    const token = jwt.generateToken(
      {
        roleId: 1,
        username: userData.username,
        userId: userData.id,
      },
      { expiresIn: 1 },
    );
    const context = UnitTestUtils.createMockContext(token, false);
    const valid = authGuard.canActivate(context);
    expect(valid).toBe(true);
  });
});
