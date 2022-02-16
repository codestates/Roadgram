import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { FollowDto } from './dto/follow.dto';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
    constructor(private followService: FollowService) {}

    // @Post()
    // @HttpCode(200)
    // followUnFollow(
    //   //@Headers('authorization')
    //   @Body() followDto: FollowDto,
    // ): Promise<object> {
    //   return this.followService.followUnfollow(followDto);
    // }
}
