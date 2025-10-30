import { IsNumber } from 'class-validator';

export class ToggleSubtaskDto {
  @IsNumber()
  subtaskId: number;
}
