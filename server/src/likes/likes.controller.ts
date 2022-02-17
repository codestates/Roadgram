import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesDto } from './dto/likes.dto';

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
}
