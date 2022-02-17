import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @IsNotEmpty()
  @IsNumber()
  user: number;

  @IsNotEmpty()
  @IsNumber()
  articleId: number;
  
  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class ModifyCommentDto {
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @IsNotEmpty()
  @IsNumber()
  commentId: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
