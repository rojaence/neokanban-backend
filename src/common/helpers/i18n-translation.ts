import { Injectable } from '@nestjs/common';
import { I18nPath } from '@src/generated/i18n.generated';
import { I18nService, TranslateOptions } from 'nestjs-i18n';
@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}

  t(
    key: I18nPath,
    args?: TranslateOptions,
  ): string | number | boolean | object | any[] {
    return this.i18n.t(key, { args });
  }
}
