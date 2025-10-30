import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@/database/database.service';
import { ToggleSubtaskDto } from './dto/toggle-subtask.dto';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) { }

  /**
   * Standard select configuration for task responses
   * Maps columnId to status and includes assignee relation
   */
  private readonly taskSelect = {
    id: true,
    title: true,
    description: true,
    assignee: { //  this might be a user
      select: {
        id: true,
        name: true,
        email: true,
      }
    },
    status: {  // this is a column
      select: {
        id: true,
      }
    },
    subtasks: {
      select: {
        id: true,
        name: true,
        completed: true,
      }
    }
  };

  /**
   * Transform the task to include _id and map status to just the id
   */
  private transformTask(task: any) {
    return {
      ...task,
      _id: task.id,
      status: task.status?.id || null,
    };
  }

  async create(createTaskDto: Prisma.TaskCreateInput) {
    const task = await this.databaseService.task.create({
      data: createTaskDto,
      select: this.taskSelect,
    });
    return this.transformTask(task);
  }

  async findAll() {
    const tasks = await this.databaseService.task.findMany({
      select: this.taskSelect,
    });
    return tasks.map(task => this.transformTask(task));
  }

  async findOne(id: number) {
    const task = await this.databaseService.task.findFirst({
      where: { id },
      select: this.taskSelect,
    });
    return task ? this.transformTask(task) : null;
  }

  async update(id: number, updateTaskDto: Prisma.TaskUpdateInput) {
    const task = await this.databaseService.task.update({
      where: { id },
      data: updateTaskDto,
      select: this.taskSelect,
    });
    return this.transformTask(task);
  }

  async remove(id: number) {
    const task = await this.databaseService.task.delete({
      where: { id },
      select: this.taskSelect,
    });
    return this.transformTask(task);
  }

  async toggleSubtask(taskId: number, toggleSubtaskDto: ToggleSubtaskDto) {
    // First, get the current subtask to find its completed state
    const subtask = await this.databaseService.subTask.findUnique({
      where: { id: toggleSubtaskDto.subtaskId },
    });

    if (!subtask) {
      throw new Error('Subtask not found');
    }

    // Toggle the completed field
    await this.databaseService.subTask.update({
      where: { id: toggleSubtaskDto.subtaskId },
      data: {
        completed: !subtask.completed,
      },
    });

    // Return the updated task with all subtasks
    const task = await this.databaseService.task.findFirst({
      where: { id: taskId },
      select: this.taskSelect,
    });

    return task ? this.transformTask(task) : null;
  }
}
