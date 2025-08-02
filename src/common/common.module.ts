import { Module } from '@nestjs/common';
import { TranslationService } from './helpers/i18n-translation';
import { PrismaService } from '@src/database/prisma/prisma.service';
import { MongoService } from '@src/database/mongo/mongo.service';

@Module({
  providers: [PrismaService, TranslationService, MongoService],
  exports: [PrismaService, TranslationService, MongoService],
})
export class CommonModule {}
