import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsService } from './columns.service';
import { DatabaseService } from '@/database/database.service';
import { createMockDatabaseService } from '@/__mocks__';

describe('ColumnsService', () => {
  let service: ColumnsService;
  let databaseService: DatabaseService;
  let mockDatabaseService: ReturnType<typeof createMockDatabaseService>;

  beforeEach(async () => {
    mockDatabaseService = createMockDatabaseService();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ColumnsService>(ColumnsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
