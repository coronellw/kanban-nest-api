type MockEntityService = {
  create: jest.Mock;
  findMany: jest.Mock;
  findFirst: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

/**
 * Creates a generic mock entity service with all standard Prisma CRUD methods
 * @param overrides - Optional overrides for specific methods
 * @returns Mock entity service with jest functions
 */
export const createMockEntityService = (overrides?: Partial<MockEntityService>): MockEntityService => ({
  create: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  ...overrides,
});

/**
 * Creates a complete mock database service with all entities
 * Each entity gets its own isolated set of mock functions
 * @returns Mock database service with all Prisma models
 */
export const createMockDatabaseService = () => ({
  user: createMockEntityService(),
  board: createMockEntityService(),
  column: createMockEntityService(),
  task: createMockEntityService(),
});

export const mockDatabaseService = createMockDatabaseService();