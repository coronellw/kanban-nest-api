import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { DatabaseService } from '@/database/database.service';
import { createMockDatabaseService } from '@/__mocks__';

describe('BoardsService', () => {
  let service: BoardsService;
  let databaseService: DatabaseService;
  let mockDatabaseService: ReturnType<typeof createMockDatabaseService>;

  beforeEach(async () => {
    mockDatabaseService = createMockDatabaseService();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
