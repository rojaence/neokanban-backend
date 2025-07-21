import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';
import { DynamicModule } from '@nestjs/common';

export class BaseUnitTestModule {
  static forRoot(): DynamicModule {
    return {
      module: BaseUnitTestModule,
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'es',
          loaderOptions: {
            path: path.join(__dirname, '../../src/i18n'),
            watch: false,
          },
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
          ],
        }),
      ],
      exports: [I18nModule],
    };
  }
}
