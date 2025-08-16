import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { BaseUnitTestModule } from '@src/common/test/unit/unit-test.module';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtBlacklistRepository } from '../../repositories/jwt-blacklist.repository';
import { OtpService } from '../../services/otp/otp.service';
import { OtpRepository } from '../../repositories/otp.repository';
import { JwtWhitelistRepository } from '../../repositories/jwt-whitelist.repository';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [BaseUnitTestModule.forRoot()],
      providers: [
        AuthService,
        AuthRepository,
        JwtBlacklistRepository,
        JwtWhitelistRepository,
        OtpService,
        OtpRepository,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
