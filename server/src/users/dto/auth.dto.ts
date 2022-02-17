import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AuthDto{
    @IsNumber()
    @IsNotEmpty()
    id:number;

    @IsNumber()
    @IsNotEmpty()
    loginMethod:number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    accessToken?:string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    refreshToken?:string;
}