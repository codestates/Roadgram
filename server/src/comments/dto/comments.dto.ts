import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({description: '로그인 방식'})
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @ApiProperty({description: '유저ID'})
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @ApiProperty({description: '게시물 ID'})
  @IsNotEmpty()
  @IsNumber()
  articleId: number;
  
  @ApiProperty({description: '로그인 방식'})
  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class ModifyCommentDto {
  @ApiProperty({description: '로그인 방식'})
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @ApiProperty({description: '유저ID'})
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @ApiProperty({description: '댓글ID'})
  @IsNotEmpty()
  @IsNumber()
  commentId: number;

  @ApiProperty({description: '댓글내용'})
  @IsNotEmpty()
  @IsString()
  comment: string;
}
