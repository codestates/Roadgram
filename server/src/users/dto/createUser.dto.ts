import { IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    email:string;

    @IsString()
    password:string;

    @IsString()
    nickname:string;
}