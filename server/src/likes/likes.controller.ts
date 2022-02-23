import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesDto } from './dto/likes.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    likeUnlike(
      @Body() likesDto: LikesDto,
    ): Promise<object> {
      return this.likesService.likeUnlike(likesDto);
    }
}
