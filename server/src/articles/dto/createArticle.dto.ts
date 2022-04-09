import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({description: '유저ID'})
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @ApiProperty({description: '경로'})
  @IsNotEmpty()
  @IsArray()
  road: Object[];

  @ApiProperty({description: '태그'})
  @IsNotEmpty()
  @IsArray()
  tag?: Object[];

  @ApiProperty({description: '본문'})
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({description: '썸네일'})
  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @ApiProperty({description: '로그인 방식'})
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;
}