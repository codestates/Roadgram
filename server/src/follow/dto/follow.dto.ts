import { IsNumber, IsNotEmpty } from 'class-validator';

export class FollowDto {
  @IsNotEmpty()
  @IsNumber()
  loginMethod: number;

  @IsNotEmpty()
  @IsNumber()
  user: number;

  @IsNotEmpty()
  @IsNumber()
  followingUserId: number;
}