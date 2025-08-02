import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { IJwtPayload } from '../../models/auth.interface';
import { fakeAdminUser } from '@src/test/fakes/user';

describe('JwtService', () => {
  let service: JwtService;
  const userData = fakeAdminUser;

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
      username: userData.username,
      roleId: 1,
      userId: userData.id,
    };
    const token = service.generateToken(payload);
    expect(token).toBeDefined();
  });

  it('should verify a valid token', () => {
    const payload: IJwtPayload = {
      username: userData.username,
      roleId: 1,
      userId: userData.id,
    };
    const token = service.generateToken(payload);
    const result = service.verifyToken(token);
    expect(result.valid).toBe(true);
    expect(result.decoded).toHaveProperty('username', userData.username);
  });
});
