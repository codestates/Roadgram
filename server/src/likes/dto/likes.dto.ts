import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class LikesDto {
  @ApiProperty({description: "로그인 방식"})
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @ApiProperty({description: "유저ID"})
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @ApiProperty({description: "게시물ID"})
  @IsNotEmpty()
  @IsNumber()
  articleId: number;
}
