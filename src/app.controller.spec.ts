import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseUnitTestModule } from './common/test/unit/unit-test.module';
import { MailService } from './mail/mail.service';
import { MockMailService } from 'test/mocks/mail.service.mock';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [BaseUnitTestModule.forRoot()],
      providers: [
        AppService,
        {
          provide: MailService,
          useClass: MockMailService,
        },
      ],
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBeDefined();
    });
  });
});
