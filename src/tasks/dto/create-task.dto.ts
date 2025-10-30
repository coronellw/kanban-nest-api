import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubTaskDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  status?: number | string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubTaskDto)
  subtasks?: CreateSubTaskDto[];
}
