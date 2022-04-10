import { Body, Controller, Get, HttpCode, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotAcceptableResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { FollowDto } from './dto/follow.dto';
import { FollowService } from './follow.service';
import { FollowUnfollow404Response, FollowUnfollowResponse } from './response/followUnfollow.response';
import { GetFollowerList404Response, GetFollowerList406Response, GetFollowerListResponse } from './response/getFollowerList.response';
import { GetFollowingList404Response, GetFollowingList406Response, GetFollowingListResponse } from './response/getFollowingList.response';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  @ApiOperation({summary: "팔로우 / 언팔로우" ,description: "팔로우 / 언팔로우 결과를 출력한다."})
  @ApiCreatedResponse({description: "팔로우 / 언팔로우 성공", type: FollowUnfollowResponse})
  @ApiNotFoundResponse({description: "팔로우할 ID를 찾을 수 없음", type: FollowUnfollow404Response})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  followUnFollow(
    @Body() followDto: FollowDto
  ): Promise<object> {
    return this.followService.followUnfollow(followDto);
  };

  @Get('/follower')
  @ApiOperation({summary: "팔로워 리스트 조회" ,description: "유저의 팔로워 리스트를 조회한다."})
  @ApiOkResponse({description: "팔로워 리스트를 성공적으로 조회함", type: GetFollowerListResponse})
  @ApiNotFoundResponse({description: "유저나 팔로워를 리스트를 찾을 수 없음", type: GetFollowerList404Response})
  @ApiNotAcceptableResponse({description: "유효한 페이지 쿼리 요청이 아님", type: GetFollowerList406Response})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getFollowerList( 
    @Query('user', ParseIntPipe) user: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.followService.getFollowerList(user, page);
  };

  @Get('/following')
  @ApiOperation({summary: "팔로잉 리스트 조회" ,description: "유저의 팔로잉 리스트를 조회한다."})
  @ApiOkResponse({description: "팔로잉 리스트를 성공적으로 조회함", type: GetFollowingListResponse})
  @ApiNotFoundResponse({description: "유저나 팔로잉 리스트를 찾을 수 없음", type: GetFollowingList404Response})
  @ApiNotAcceptableResponse({description: "유효한 페이지 쿼리 요청이 아님", type: GetFollowingList406Response})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getFollowingList(
    @Query('user', ParseIntPipe) user: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.followService.getFollowingList(user, page);
  };
};
