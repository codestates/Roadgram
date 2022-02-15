import { Body, Controller, Get, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesDto } from './dto/likes.dto';
import { Likes } from './entities/likes.entity';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  //   @Post()
  //   likeUnlike(
  //     //@Headers('authorization')
  //     @Body() likesDto: LikesDto,
  //   ): Promise<Likes> {
  //     return this.likesService.likeUnlike(likesDto);
  //   }

  //   @Post()
  //   unLikeArticle(
  //     //@Headers('authorization')
  //     @Body() likesDto: LikesDto,
  //   ): Promise<Likes> {
  //     return this.likesService.unLikeArticle(LikesDto);
  //   }
}
