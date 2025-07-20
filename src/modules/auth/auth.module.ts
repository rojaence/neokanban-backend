import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthRepository } from '@auth/repositories/auth.repository';
import { PrismaService } from '@src/database/prisma/prisma.service';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import { HttpResponse } from '@src/common/helpers/http-response';
import { JwtService } from './services/jwt/jwt.service';

@Module({
  providers: [
    AuthService,
    AuthRepository,
    PrismaService,
    BcryptService,
    HttpResponse,
    JwtService,
  ],
})
export class AuthModule {}
