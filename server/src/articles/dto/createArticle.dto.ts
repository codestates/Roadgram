import { IsArray, IsNotEmpty, IsNumber, isObject, IsObject, IsString } from "class-validator";

export class CreateArticleDto {
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @IsNotEmpty()
  @IsArray()
  road: Object[];

  @IsNotEmpty()
  @IsArray()
  tag?: Object[];

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;
}