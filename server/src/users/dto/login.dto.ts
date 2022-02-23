import { isNotEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LoginDto {

    @IsString()
    email: string;

    @IsString()
    password: string;
}

export class EmailDto {
    @IsString()
    @IsNotEmpty()
    email: string;
}

export class NicknameDto {
    @IsString()
    @IsNotEmpty()
    nickname: string;
}

export class IdDto {
    @IsNumber()
    @IsNotEmpty()
    user: number;

    @IsNumber()
    @IsNotEmpty()
    loginMethod: number;
}

export class QueryDto {
    @IsNotEmpty()
    user: number;

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