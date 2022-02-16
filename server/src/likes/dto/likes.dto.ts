import { IsNumber, IsNotEmpty } from 'class-validator';

export class LikesDto {
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  articleId: number;
}
