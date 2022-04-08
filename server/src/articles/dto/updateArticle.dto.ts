import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateArticleDto {
  @ApiProperty({description: '로그인 방식'})
  @IsNotEmpty()  
  @IsNumber()
  loginMethod: number;

  @ApiProperty({description: '유저ID'})
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @ApiProperty({description: '게시물ID'})
  @IsNotEmpty()
  @IsNumber()
  articleId: number;

  @ApiPropertyOptional({description: '본문'})
  @IsOptional()
  @IsString()
  content?: string;
  
  @ApiPropertyOptional({description: '태그', type: [Object]})
  @IsOptional()
  @IsArray()
  tag?: [] | object[];
}