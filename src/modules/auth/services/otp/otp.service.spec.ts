import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { OtpRepository } from '../../repositories/otp.repository';
import { BaseUnitTestModule } from '@src/common/test/unit/unit-test.module';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BaseUnitTestModule.forRoot()],
      providers: [OtpService, OtpRepository],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
