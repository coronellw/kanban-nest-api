# Test Mocks

This directory contains centralized mocks and test utilities for the Kanban API project.

## Files

### `database.service.mock.ts`
Contains mock implementations for the DatabaseService, including:
- `createMockEntityService()` - Generic factory for creating entity mocks with standard Prisma CRUD methods
- `createMockDatabaseService()` - Creates complete database service mock with all entities
- All Prisma model methods (create, findMany, findFirst, findUnique, update, delete)

### `test-data.mock.ts`
Contains predefined mock data for all entities (users, boards, columns, tasks).

### `test-utils.ts`
Contains utility functions to reduce test boilerplate.

### `index.ts`
Exports all mocks and utilities for easy importing.

## Usage

### Creating Entity-Specific Mocks with `createMockEntityService`

The `createMockEntityService` function provides a DRY way to create mocks for individual entities:

```typescript
import { createMockEntityService } from '@/__mocks__';

// Basic entity mock with all standard methods
const mockUserService = createMockEntityService();

// Entity mock with specific method overrides
const mockUserServiceWithDefaults = createMockEntityService({
  findUnique: jest.fn().mockResolvedValue(mockUserData.basic),
  create: jest.fn().mockResolvedValue(mockUserData.basic),
});

// Use in your tests
mockUserService.findFirst.mockResolvedValue(someUser);
mockUserService.create.mockResolvedValue(newUser);
```

### Advanced: Creating Custom Database Services

```typescript
import { createMockEntityService, createMockDatabaseService } from '@/__mocks__';

// Create a database service with entity-specific behavior
const createCustomMockDatabaseService = () => ({
  user: createMockEntityService({
    findUnique: jest.fn().mockResolvedValue(null), // Default to user not found
  }),
  board: createMockEntityService({
    findMany: jest.fn().mockResolvedValue([]), // Default to empty boards
  }),
  column: createMockEntityService(),
  task: createMockEntityService(),
});
```

### Basic Service Test

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';
import { DatabaseService } from '@/database/database.service';
import { createMockDatabaseService } from '@/__mocks__';

describe('YourService', () => {
  let service: YourService;
  let mockDatabaseService: ReturnType<typeof createMockDatabaseService>;

  beforeEach(async () => {
    mockDatabaseService = createMockDatabaseService();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YourService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<YourService>(YourService);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### Controller Test with Service

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourController } from './your.controller';
import { YourService } from './your.service';
import { DatabaseService } from '@/database/database.service';
import { createMockDatabaseService } from '@/__mocks__';

describe('YourController', () => {
  let controller: YourController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YourController],
      providers: [
        YourService,
        {
          provide: DatabaseService,
          useValue: createMockDatabaseService(),
        },
      ],
    }).compile();

    controller = module.get<YourController>(YourController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
```

### Using Test Utilities (Advanced)

```typescript
import { createTestModuleWithMockDatabase, resetAllMocks } from '@/__mocks__';
import { YourService } from './your.service';

describe('YourService', () => {
  let service: YourService;
  let mockDatabaseService: ReturnType<typeof createMockDatabaseService>;

  beforeEach(async () => {
    const { module, mockDatabaseService: mockDb } = await createTestModuleWithMockDatabase({
      providers: [YourService],
    });

    service = module.get<YourService>(YourService);
    mockDatabaseService = mockDb;
    
    resetAllMocks(mockDatabaseService);
  });

  // Your tests here...
});
```

### Using Mock Data

```typescript
import { mockUserData, mockBoardData } from '@/__mocks__';

describe('YourService', () => {
  it('should create a user', async () => {
    const userData = mockUserData.basic;
    mockDatabaseService.user.create.mockResolvedValue(userData);

    const result = await service.create(userData);
    
    expect(mockDatabaseService.user.create).toHaveBeenCalledWith({
      data: userData,
    });
    expect(result).toEqual(userData);
  });
});
```

## Benefits

1. **Consistency**: All tests use the same mock structure
2. **DRY Principle**: No code duplication across test files - uses generic `createMockEntityService`
3. **Easy Maintenance**: Changes to mocks are centralized
4. **Type Safety**: Mocks maintain TypeScript typing
5. **Comprehensive**: Covers all Prisma models and methods
6. **Reusable Data**: Predefined mock data for common scenarios
7. **Flexibility**: Entity-specific customizations through `createMockEntityService` overrides
8. **Isolation**: Each entity gets its own isolated mock functions