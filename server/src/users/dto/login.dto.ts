import { ApiProperty } from "@nestjs/swagger";
import { isNotEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({description: "이메일"})
    @IsString()
    email: string;

    @ApiProperty({description: "패스워드"})
    @IsString()
    password: string;
}

export class EmailDto {
    @ApiProperty({description: "이메일"})
    @IsString()
    @IsNotEmpty()
    email: string;
}

export class NicknameDto {
    @ApiProperty({description: "닉네임"})
    @IsString()
    @IsNotEmpty()
    nickname: string;
}

export class IdDto {
    @ApiProperty({description: "유저ID"})
    @IsNumber()
    @IsNotEmpty()
    user: number;

    @ApiProperty({description: "로그인 방식"})
    @IsNumber()
    @IsNotEmpty()
    loginMethod: number;
}

export class QueryDto {
    @ApiProperty({description: "유저ID"})
    @IsNotEmpty()
    user: number;
    
    @ApiProperty({description: "로그인 방식"})
    @IsNotEmpty()
    loginMethod: number;
}

export class KakaoLoginDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class TokenDto {
    @IsString()
    @IsNotEmpty()
    authorization: string;
}