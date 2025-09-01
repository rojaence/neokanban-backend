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
import { OtpController } from './controllers/otp/otp.controller';
import { JwtWhitelistRepository } from './repositories/jwt-whitelist.repository';
import { MailService } from '@src/mail/mail.service';

@Module({
  providers: [
    AuthService,
    AuthRepository,
    BcryptService,
    MailService,
    JwtService,
    JwtBlacklistRepository,
    JwtWhitelistRepository,
    OtpRepository,
    OtpService,
  ],
  imports: [CommonModule],
  controllers: [AuthController, OtpController],
})
export class AuthModule {}
