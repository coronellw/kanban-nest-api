import { Prisma } from '@prisma/client';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomLoggerService } from '@/custom-logger/custom-logger.service';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ToggleSubtaskDto } from './dto/toggle-subtask.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  private readonly logger = new CustomLoggerService(TasksController.name);

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    // Transform the DTO to Prisma TaskCreateInput format
    const taskData: Prisma.TaskCreateInput = {
      title: createTaskDto.title,
      description: createTaskDto.description,
    };

    // Handle assignee (user) relation if userId is provided
    if (createTaskDto.userId) {
      taskData.assignee = {
        connect: { id: createTaskDto.userId }
      };
    }

    // Handle status (column) relation if columnId is provided
    if (createTaskDto.status) {
      taskData.status = {
        connect: { id: typeof createTaskDto.status === 'string' ? Number(createTaskDto.status) : createTaskDto.status }
      };
    }

    // Handle subtasks creation if provided
    if (createTaskDto.subtasks && createTaskDto.subtasks.length > 0) {
      taskData.subtasks = {
        create: createTaskDto.subtasks.map(subtask => ({
          name: subtask.name,
          completed: subtask.completed ?? false,
        }))
      };
    }

    this.logger.log('Creating new Task')
    this.logger.log(JSON.stringify(createTaskDto, undefined, 2))

    return this.tasksService.create(taskData);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    // Transform the DTO to Prisma TaskUpdateInput format
    const taskData: Prisma.TaskUpdateInput = {};

    // Update title if provided
    if (updateTaskDto.title !== undefined) {
      taskData.title = updateTaskDto.title;
    }

    // Update description if provided
    if (updateTaskDto.description !== undefined) {
      taskData.description = updateTaskDto.description;
    }

    // Handle assignee (user) relation if userId is provided
    if (updateTaskDto.userId !== undefined) {
      if (updateTaskDto.userId === null) {
        taskData.assignee = { disconnect: true };
      } else {
        taskData.assignee = { connect: { id: updateTaskDto.userId } };
      }
    }

    // Handle status (column) relation if status is provided
    if (updateTaskDto.status !== undefined) {
      if (updateTaskDto.status === null) {
        taskData.status = { disconnect: true };
      } else {
        taskData.status = { 
          connect: { 
            id: typeof updateTaskDto.status === 'string' ? Number(updateTaskDto.status) : updateTaskDto.status 
          } 
        };
      }
    }

    // Handle subtasks update if provided
    if (updateTaskDto.subtasks) {
      // For now, we'll replace all subtasks
      taskData.subtasks = {
        deleteMany: {},
        create: updateTaskDto.subtasks.map(subtask => ({
          name: subtask.name,
          completed: subtask.completed ?? false,
        }))
      };
    }

    this.logger.log(`Updating Task ${id}`);
    this.logger.log(JSON.stringify(updateTaskDto, undefined, 2));

    return this.tasksService.update(+id, taskData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  @Patch(':id/subtask/toggle')
  toggleSubtask(@Param('id') id:string, @Body() toggleSubtaskDto: ToggleSubtaskDto) {

  }
}
