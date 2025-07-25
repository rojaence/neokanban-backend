import { Module } from '@nestjs/common';
import { TranslationService } from './helpers/i18n-translation';
import { PrismaService } from '@src/database/prisma/prisma.service';

@Module({
  providers: [PrismaService, TranslationService],
  exports: [PrismaService, TranslationService],
})
export class CommonModule {}
