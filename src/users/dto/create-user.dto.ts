import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
export class CreateUserDto {
    name: string;

    email: string;

    password: string;

    dateOfBirth: Date;

    tokens: string[];
}
