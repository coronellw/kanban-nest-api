import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    email: string;

    password: string;

    dateOfBirth: Date;

    tokens: string[];
}
