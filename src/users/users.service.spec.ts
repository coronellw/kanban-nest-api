import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { DatabaseService } from '@/database/database.service';
import { CustomLoggerService } from '@/custom-logger/custom-logger.service';
import { LoginUserDto } from './dto/login-user.dto';
import { createMockDatabaseService, mockUserData } from '@/__mocks__';

describe('UsersService', () => {
  let service: UsersService;
  let databaseService: DatabaseService;
  let mockDatabaseService: ReturnType<typeof createMockDatabaseService>;

  const hashedPassword = '$2b$10$5vXgbdVmlhMAuaexzx/e7uedUTSf4at7JJkgam9NBQSFndt76YnWC'; // bcrypt hash of 'password123'
  const mockUser = {
    ...mockUserData.basic,
    password: hashedPassword, // Use hashed password in mock
  };
  const mockUserWithoutSensitiveData = mockUserData.withoutSensitiveData;

  const mockUserWithRelations = {
    ...mockUser,
    boards: [],
    tasks: [],
  };

  beforeEach(async () => {
    mockDatabaseService = createMockDatabaseService();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: CustomLoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    databaseService = module.get<DatabaseService>(DatabaseService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
      };

      mockDatabaseService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      // Expect that the password was hashed before saving
      expect(databaseService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: createUserDto.email,
          name: createUserDto.name,
          dateOfBirth: createUserDto.dateOfBirth,
          password: expect.not.stringMatching('password123'), // Password should be hashed, not plain text
        }),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users with boards and tasks, omitting sensitive data', async () => {
      mockDatabaseService.user.findMany.mockResolvedValue([mockUserWithoutSensitiveData]);

      const result = await service.findAll();

      expect(databaseService.user.findMany).toHaveBeenCalledWith({
        include: {
          boards: true,
          tasks: true,
        },
        omit: {
          dateOfBirth: true,
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual([mockUserWithoutSensitiveData]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      mockDatabaseService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findOne(userId);

      expect(databaseService.user.findFirst).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const userId = 999;
      mockDatabaseService.user.findFirst.mockResolvedValue(null);

      const result = await service.findOne(userId);

      expect(databaseService.user.findFirst).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: Prisma.UserUpdateInput = {
        name: 'Jane Smith',
      };
      const updatedUser = { ...mockUser, name: 'Jane Smith' };

      mockDatabaseService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(databaseService.user.update).toHaveBeenCalledWith({
        data: updateUserDto,
        where: { id: userId },
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = 1;
      mockDatabaseService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove(userId);

      expect(databaseService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login(loginUserDto);

      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
      
      // Should return user without password
      const { password, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockDatabaseService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );

      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );

      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
    });

    it('should not return password in successful login', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login(loginUserDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('name');
    });
  });
});
