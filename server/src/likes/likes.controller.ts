import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesDto } from './dto/likes.dto';
import { Likes } from './entities/likes.entity';
import { Article } from 'src/articles/entities/article.entity';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

    @Post()
    @HttpCode(200)
    likeUnlike(
      //@Headers('authorization')
      @Body() likesDto: LikesDto,
    ): Promise<object> {
      return this.likesService.likeUnlike(likesDto);
    }

    // @Post()
    // unLikeArticle(
    //   //@Headers('authorization')
    //   @Body() likesDto: LikesDto,
    // ): Promise<Likes> {
    //   return this.likesService.unLikeArticle(LikesDto);
    // }
}
