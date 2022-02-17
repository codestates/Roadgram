import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsNumber()
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
    loginMethod: number;
}