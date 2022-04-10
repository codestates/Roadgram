import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesDto } from './dto/likes.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeUnLike404Response, LikeUnLikeResponse } from './response/likeUnlike.response';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

    @Post()
    @ApiOperation({summary: "좋아요 / 좋아요 취소 API", description: "좋아요 / 좋아요 취소 결과"})
    @ApiCreatedResponse({description: "좋아요 / 좋아요 취소가 정상적으로 처리됨", type: LikeUnLikeResponse})
    @ApiNotFoundResponse({description: "해당 게시물을 찾을 수 없음", type: LikeUnLike404Response})
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    likeUnlike(
      @Body() likesDto: LikesDto,
    ): Promise<object> {
      return this.likesService.likeUnlike(likesDto);
    }
}
