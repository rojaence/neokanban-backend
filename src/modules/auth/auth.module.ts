import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthRepository } from '@auth/repositories/auth.repository';
import { CommonModule } from '@src/common/common.module';
import { JwtService } from './services/jwt/jwt.service';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import { AuthController } from './controllers/auth/auth.controller';
import { JwtBlacklistRepository } from './repositories/jwt-blacklist.repository';
import { OtpRepository } from './repositories/otp.repository';
import { OtpService } from './services/otp/otp.service';

@Module({
  providers: [
    AuthService,
    AuthRepository,
    BcryptService,
    JwtService,
    JwtBlacklistRepository,
    OtpRepository,
    OtpService,
  ],
  imports: [CommonModule],
  controllers: [AuthController],
})
export class AuthModule {}
