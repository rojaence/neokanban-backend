import { Test, TestingModule } from '@nestjs/testing';
import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateService],
    }).compile();

    service = module.get<DateService>(DateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be false when dateA is not before than dateB', () => {
    let dateA = service.getNow();
    let dateB = service.getNow();
    dateA = service.addMinutes(dateA, 5);
    const isBefore = service.isBefore(dateA, dateB);
    expect(isBefore).toBe(false);

    dateA = service.getNow();
    dateB = service.getNow();
    expect(isBefore).toBe(false);
  });

  it('should be true when dateA is not before than dateB', () => {
    let dateA = service.getNow();
    let dateB = service.getNow();
    dateB = service.addMinutes(dateB, 5);
    const isBefore = service.isBefore(dateA, dateB);
    expect(isBefore).toBe(true);

    dateA = service.getNow();
    dateB = service.getNow();
    dateA = service.addMinutes(dateA, -1);
    expect(isBefore).toBe(true);
  });
});
