import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import { BaseUnitTestModule } from '@src/common/test/unit/unit-test.module';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import { LoggingService } from '@src/common/services/logging/logging.service';

describe('HttpExceptionFilter', () => {
  let translationService: TranslationService;
  let loggingService: LoggingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BaseUnitTestModule.forRoot()],
    }).compile();
    translationService = module.get<TranslationService>(TranslationService);
    loggingService = module.get<LoggingService>(LoggingService);
  });

  it('should be defined', () => {
    expect(
      new HttpExceptionFilter(translationService, loggingService),
    ).toBeDefined();
  });
});
