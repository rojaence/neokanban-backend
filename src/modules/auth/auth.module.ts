import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthRepository } from '@auth/repositories/auth.repository';
import { CommonModule } from '@src/common/common.module';
import { JwtService } from './services/jwt/jwt.service';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import { AuthController } from './controllers/auth/auth.controller';

@Module({
  providers: [AuthService, AuthRepository, BcryptService, JwtService],
  imports: [CommonModule],
  controllers: [AuthController],
})
export class AuthModule {}
