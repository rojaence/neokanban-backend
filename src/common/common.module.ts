import { Module } from '@nestjs/common';
import { TranslationService } from './helpers/i18n-translation';
import { PrismaService } from '@src/database/prisma/prisma.service';
import { MongoService } from '@src/database/mongo/mongo.service';
import { DateService } from './services/date/date.service';

@Module({
  providers: [PrismaService, TranslationService, MongoService, DateService],
  exports: [PrismaService, TranslationService, MongoService, DateService],
})
export class CommonModule {}
