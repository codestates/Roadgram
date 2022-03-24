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
  };

  @Get('/follower')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  getFollowerList( 
    @Query('user', ParseIntPipe) user: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.followService.getFollowerList(user, page);
  };

  @Get('/following')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  getFollowingList(
    @Query('user', ParseIntPipe) user: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.followService.getFollowingList(user, page);
  };
};
