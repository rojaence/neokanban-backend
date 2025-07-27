import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import { BaseUnitTestModule } from '@src/common/test/unit/unit-test.module';
import { TranslationService } from '@src/common/helpers/i18n-translation';

describe('HttpExceptionFilter', () => {
  let translationService: TranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BaseUnitTestModule.forRoot()],
    }).compile();
    translationService = module.get<TranslationService>(TranslationService);
  });

  it('should be defined', () => {
    expect(new HttpExceptionFilter(translationService)).toBeDefined();
  });
});
