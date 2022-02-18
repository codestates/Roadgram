import { Body, Controller, Get, HttpCode, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { FollowDto } from './dto/follow.dto';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  followUnFollow(
    @Body() followDto: FollowDto
  ): Promise<object> {
    return this.followService.followUnfollow(followDto);
  }

  @Get('/follower')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  getFollowerList( 
    @Query('loginMethod') loginMethod: number,
    @Query('user') user: number
  ): Promise<object> {
    return this.followService.getFollowerList(user);
  }

  @Get('/following')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  getFollowingList(
    @Query('loginMethod', ParseIntPipe) loginMethod: number,
    @Query('user', ParseIntPipe) user: number
  ): Promise<object> {
    return this.followService.getFollowingList(user);
  }
}
