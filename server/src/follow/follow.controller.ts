import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { FollowDto } from './dto/follow.dto';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  @HttpCode(200)
  followUnFollow(
    //@Headers('authorization')
    @Body() followDto: FollowDto
  ): Promise<object> {
    return this.followService.followUnfollow(followDto);
  }

  @Get('/follower')
  @HttpCode(200)
  getFollowerList( 
    @Query('loginmethod') loginmethod: number,
    @Query('user') user: number
  ): Promise<object> {
    return this.followService.getFollowerList(user);
  }

  @Get('/following')
  @HttpCode(200)
  getFollowingList(
    @Query('loginmethod') loginmethod: number,
    @Query('user') user: number
  ): Promise<object> {
    return this.followService.getFollowingList(user);
  }
}
