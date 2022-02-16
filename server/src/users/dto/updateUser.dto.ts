import { IsNumber, IsString } from "class-validator";

export class UpdateUserDto {
    @IsNumber()
    user:number;

    @IsString()
    statusMessage?:string;

    @IsString()
    profileImage?:string;

    @IsString()
    password?:string;

    @IsString()
    nickname?:string;

    @IsNumber()
    loginMethod:number;
}