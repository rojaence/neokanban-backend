import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@src/database/prisma/prisma.service';
import { BaseUnitTestModule } from '../../../../common/test/unit/unit-test.module';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import { MockPrismaService } from '@src/database/mocks/prismaClient/mockPrisma.service';
import { AuthRepository } from '../../repositories/auth.repository';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import { JwtService } from '../jwt/jwt.service';
import { JwtBlacklistRepository } from '../../repositories/jwt-blacklist.repository';
import { MongoService } from '@src/database/mongo/mongo.service';
import { MockMongoService } from '@src/database/mocks/mongo-client/mock-mongo.service';
import { JwtBlacklistCreateDTO } from '../../models/jwt-blacklist.interface';
import { fakeAdminUser, defaultFakePassword } from '@src/test/fakes/user';
import { JwtWhitelistRepository } from '../../repositories/jwt-whitelist.repository';
import { ObjectId, WithId } from 'mongodb';
import { randomUUID } from 'node:crypto';
import { JwtWhitelist } from '../../models/jwt-whitelist.interface';

describe('AuthService', () => {
  let service: AuthService;
  let translationService: TranslationService;
  let jwtService: JwtService;
  let jwtBlacklistRepository: JwtBlacklistRepository;
  let jwtWhitelistRepository: JwtWhitelistRepository;
  const userData = fakeAdminUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        BcryptService,
        JwtService,
        TranslationService,
        AuthRepository,
        JwtBlacklistRepository,
        JwtWhitelistRepository,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
        {
          provide: MongoService,
          useClass: MockMongoService,
        },
      ],
      imports: [BaseUnitTestModule.forRoot()],
    }).compile();

    service = module.get<AuthService>(AuthService);
    translationService = module.get<TranslationService>(TranslationService);
    jwtService = module.get<JwtService>(JwtService);
    jwtWhitelistRepository = module.get<JwtWhitelistRepository>(
      JwtWhitelistRepository,
    );
    jwtBlacklistRepository = module.get<JwtBlacklistRepository>(
      JwtBlacklistRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate token with valid credentials', async () => {
    const credentials = {
      username: userData.username,
      password: defaultFakePassword,
    };
    const response = await service.login(credentials);
    expect(response).toBeDefined();
  });

  it('should handle error with user not found', async () => {
    const credentials = { username: 'noexistsuser', password: '12345' };
    const loginFunction = async () => await service.login(credentials);
    const errorMessage = translationService.t(
      'auth.invalidCredentials',
    ) as string;
    await expect(loginFunction).rejects.toThrow(errorMessage);
  });

  it('should handle error to invalid password', async () => {
    const credentials = {
      username: fakeAdminUser.username,
      password: 'invalid',
    };
    const loginFunction = async () => await service.login(credentials);
    const errorMessage = translationService.t(
      'auth.invalidCredentials',
    ) as string;
    await expect(loginFunction).rejects.toThrow(errorMessage);
  });

  it('should return a valid token with valid login', async () => {
    const credentials = {
      username: userData.username,
      password: defaultFakePassword,
    };
    const token = await service.login(credentials);
    const decoded = jwtService.verifyToken(token.accessToken);
    const decodedRefresh = jwtService.verifyToken(token.refreshToken);
    expect(typeof token.accessToken).toBe('string');
    expect(typeof token.refreshToken).toBe('string');
    expect(decoded.valid).toBe(true);
    expect(decodedRefresh.valid).toBe(true);
  });

  it('should return a user profile with username', async () => {
    const credentials = { username: userData.username };
    const user = await service.profile(credentials.username);
    expect(user).toBeDefined();
    expect(user).toHaveProperty('email');
  });

  it('should return a not found message with invalid username', async () => {
    const credentials = { username: 'unknown user' };
    const profileFunction = async () =>
      await service.profile(credentials.username);
    const errorMessage = translationService.t('auth.userNotFound') as string;
    await expect(profileFunction).rejects.toThrow(errorMessage);
  });

  it('should try to save documents to jwt blacklist when logout', async () => {
    const credentials = {
      username: userData.username,
      password: defaultFakePassword,
    };
    const token = await service.login(credentials);
    expect(token).toBeDefined();

    const { decoded } = jwtService.decodeToken(token.accessToken);
    const payload: JwtBlacklistCreateDTO = {
      userId: decoded!.userId,
      jti: decoded!.jti!,
      revokedAt: new Date(),
      exp: new Date(decoded!.exp! * 1000),
    };
    const doc = await service.logout(payload);
    const refreshToken = jwtService.decodeToken(token.refreshToken);
    const refreshInWhitelist = await jwtWhitelistRepository.findInWhitelist(
      refreshToken.decoded!.jti!,
    );
    const refreshInBlacklist = await jwtBlacklistRepository.findInBlacklist(
      refreshToken.decoded!.jti!,
    );

    expect(doc).toBeDefined();
    expect(doc._id).toBeDefined();
    expect(refreshInWhitelist).toBeNull();
    expect(refreshInBlacklist).toBeDefined();
  });

  it('should return new tokens when refresh auth', async () => {
    const fakeDoc: JwtWhitelist = {
      _id: new ObjectId(),
      userId: randomUUID(),
      jti: randomUUID(),
      exp: new Date(),
      pairTokenJti: randomUUID(),
      revokedAt: null,
    };

    jest
      .spyOn(jwtWhitelistRepository, 'findInWhitelist')
      .mockResolvedValueOnce(fakeDoc as WithId<JwtWhitelist>);

    const credentials = {
      username: userData.username,
      password: defaultFakePassword,
    };
    const token = await service.login(credentials);
    expect(token).toBeDefined();

    const { decoded } = jwtService.decodeToken(token.refreshToken);
    const newTokens = await service.refreshAuth(decoded!.jti!, {
      username: decoded!.username,
      id: decoded!.userId,
    });

    expect(newTokens.accessToken).toBeDefined();
    expect(newTokens.refreshToken).toBeDefined();
  });
});
