import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { MockPrismaService } from '../mocks/prismaClient/mockPrisma.service';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';

describe('PrismaService', () => {
  let db: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
        BcryptService,
      ],
    }).compile();

    db = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(db).toBeDefined();
  });

  it('should be connect to database', async () => {
    const query = await db.$queryRaw`select now()`;
    expect(query).toBeDefined();
  });
});
