import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate password hash', () => {
    const passRaw = 'mi password segura';
    const passGen = service.genPasswordHash(passRaw);
    expect(passGen).toBeDefined();
  });

  it('should compare correct password', async () => {
    const passRaw = 'hashed-password';
    const passGen = await service.genPasswordHash(passRaw);
    const isCorrect = await service.chechPasswordHash(passRaw, passGen);
    expect(isCorrect).toBe(true);
  });

  it('should compare incorrect password', async () => {
    const passRaw = 'mi password segura';
    const passIncorectRaw = 'mi password incorrecta';
    const passGen = await service.genPasswordHash(passRaw);
    const isCorrect = await service.chechPasswordHash(passIncorectRaw, passGen);
    expect(isCorrect).toBe(false);
  });
});
