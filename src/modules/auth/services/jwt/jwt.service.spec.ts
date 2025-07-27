import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { IJwtPayload } from '../../models/auth.interface';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a token with the correct payload', () => {
    const payload: IJwtPayload = {
      username: 'testuser',
      roleId: 1,
    };
    const token = service.generateToken(payload);
    expect(token).toBeDefined();
  });

  it('should verify a valid token', () => {
    const payload: IJwtPayload = {
      username: 'testuser',
      roleId: 1,
    };
    const token = service.generateToken(payload);
    const result = service.verifyToken(token);
    expect(result.valid).toBe(true);
    expect(result.decoded).toHaveProperty('username', 'testuser');
  });
});
