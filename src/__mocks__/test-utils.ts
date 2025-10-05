import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '@/database/database.service';
import { createMockDatabaseService } from './database.service.mock';

/**
 * Creates a test module with a mocked DatabaseService
 * This is a utility function to reduce boilerplate in tests
 */
export async function createTestModuleWithMockDatabase(config: {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
}): Promise<{
  module: TestingModule;
  mockDatabaseService: ReturnType<typeof createMockDatabaseService>;
}> {
  const mockDatabaseService = createMockDatabaseService();

  const module: TestingModule = await Test.createTestingModule({
    controllers: config.controllers || [],
    providers: [
      ...(config.providers || []),
      {
        provide: DatabaseService,
        useValue: mockDatabaseService,
      },
    ],
    imports: config.imports || [],
  }).compile();

  return { module, mockDatabaseService };
}

/**
 * Resets all mock functions - useful in beforeEach hooks
 */
export function resetAllMocks(mockDatabaseService: ReturnType<typeof createMockDatabaseService>): void {
  Object.values(mockDatabaseService).forEach(model => {
    Object.values(model).forEach(method => {
      if (jest.isMockFunction(method)) {
        method.mockReset();
      }
    });
  });
}