import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsNumber()
    @IsNotEmpty()
    user: number;

    @IsString()
    @IsOptional()
    statusMessage?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    nickname?: string;

    @IsNumber()
    @IsNotEmpty()
    loginMethod: number;
}