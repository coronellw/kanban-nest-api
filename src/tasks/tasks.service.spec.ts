import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DatabaseService } from '@/database/database.service';
import { createMockDatabaseService } from '@/__mocks__';

describe('TasksService', () => {
  let service: TasksService;
  let databaseService: DatabaseService;
  let mockDatabaseService: ReturnType<typeof createMockDatabaseService>;

  beforeEach(async () => {
    mockDatabaseService = createMockDatabaseService();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
