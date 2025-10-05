export const mockUserData = {
  basic: {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    name: 'John Doe',
    dateOfBirth: new Date('1990-01-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  withoutSensitiveData: {
    id: 1,
    email: 'test@example.com',
    name: 'John Doe',
  },
};

export const mockBoardData = {
  basic: {
    id: 1,
    name: 'Test Board',
    ownerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  withRelations: {
    id: 1,
    name: 'Test Board',
    columns: [],
    owner: {
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
    },
  },
};

export const mockColumnData = {
  basic: {
    id: 1,
    name: 'To Do',
    boardId: 1,
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const mockTaskData = {
  basic: {
    id: 1,
    title: 'Test Task',
    description: 'Test task description',
    columnId: 1,
    assignedUserId: 1,
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};