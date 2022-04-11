import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({description: "이메일"})
    @IsString()
    @IsNotEmpty()
    email:string;

    @ApiProperty({description: "패스워드"})
    @IsString()
    @IsNotEmpty()
    password:string;

    @ApiProperty({description: "닉네임"})
    @IsString()
    @IsNotEmpty()
    nickname:string;
}