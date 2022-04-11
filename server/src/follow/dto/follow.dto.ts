import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class FollowDto {
  @ApiProperty({description: "로그인 방식"})
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @ApiProperty({description: "유저ID"})
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @ApiProperty({description: "팔로잉 유저ID"})
  @IsNotEmpty()
  @IsNumber()
  followingUserId: number;
}