import { IsNumber, IsNotEmpty } from 'class-validator';

export class LikesDto {
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @IsNotEmpty()
  @IsNumber()
  user: number;

  @IsNotEmpty()
  @IsNumber()
  articleId: number;
}
