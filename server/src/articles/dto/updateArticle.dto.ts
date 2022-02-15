import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateArticleDto {
  @IsNotEmpty()  
  @IsNumber()
  loginmethod: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  articleId: number;

  @IsOptional()
  @IsString()
  content?: string;
  
  @IsOptional()
  @IsArray()
  tag?: [];
}