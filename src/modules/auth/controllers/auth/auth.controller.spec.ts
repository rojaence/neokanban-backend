import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { BaseUnitTestModule } from '@src/common/test/unit/unit-test.module';
import { AuthRepository } from '../../repositories/auth.repository';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import { IHttpResponse } from '@src/common/helpers/http-response';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let translation: TranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [BaseUnitTestModule.forRoot()],
      providers: [AuthService, AuthRepository],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    translation = module.get<TranslationService>(TranslationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', async () => {
    const credentials = { username: 'testuser', password: '12345' };
    const response = await controller.login(credentials);
    const successMessage: Partial<IHttpResponse<object>> = {
      statusCode: HttpStatus.OK,
      message: translation.t('validation.httpMessages.success') as string,
    };
    expect(response).toMatchObject(successMessage);
  });
});
