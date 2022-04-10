import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class LikesDto {
  @ApiProperty({description: "로그인 방식", example: 1})
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @ApiProperty({description: "유저ID", example: 5})
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @ApiProperty({description: "게시물ID",example: 15})
  @IsNotEmpty()
  @IsNumber()
  articleId: number;
}
