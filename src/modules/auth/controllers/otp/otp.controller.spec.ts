import { Test, TestingModule } from '@nestjs/testing';
import { OtpController } from './otp.controller';
import { BaseUnitTestModule } from '@src/common/test/unit/unit-test.module';
import { JwtBlacklistRepository } from '../../repositories/jwt-blacklist.repository';
import { OtpService } from '../../services/otp/otp.service';
import { OtpRepository } from '../../repositories/otp.repository';

describe('OtpController', () => {
  let controller: OtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BaseUnitTestModule.forRoot()],
      providers: [JwtBlacklistRepository, OtpService, OtpRepository],
      controllers: [OtpController],
    }).compile();

    controller = module.get<OtpController>(OtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
