import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { DatabaseService } from '@/database/database.service';
import { createMockDatabaseService } from '@/__mocks__';

describe('ColumnsController', () => {
  let controller: ColumnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnsController],
      providers: [
        ColumnsService,
        {
          provide: DatabaseService,
          useValue: createMockDatabaseService(),
        },
      ],
    }).compile();

    controller = module.get<ColumnsController>(ColumnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
