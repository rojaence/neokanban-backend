import { Module } from '@nestjs/common';
import { TranslationService } from './helpers/i18n-translation';
import { PrismaService } from '@src/database/prisma/prisma.service';
import { HttpResponse } from './helpers/http-response';

@Module({
  providers: [PrismaService, TranslationService, HttpResponse],
  exports: [PrismaService, TranslationService, HttpResponse],
})
export class CommonModule {}
