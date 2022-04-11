import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AuthDto{
    @ApiProperty({description: "유저ID"})
    @IsNumber()
    @IsNotEmpty()
    id:number;

    @ApiProperty({description: "로그인 방식"})
    @IsNumber()
    @IsNotEmpty()
    loginMethod:number;

    @ApiProperty({description: "액세스 토큰"})
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    accessToken?:string;

    @ApiProperty({description: "리프레시 토큰"})
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    refreshToken?:string;
}