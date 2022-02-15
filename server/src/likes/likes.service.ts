import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesDto } from './dto/likes.dto';
import { Likes } from './entities/likes.entity';
import { LikesRepository } from './repositories/likes.repository';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesRepository)
    private likesRepository: LikesRepository,
  ) {}

  //   likeUnlike(likesDto: LikesDto): Promise<Likes> {
  //     return this.likesRepository.likeUnlike(likesDto);
  //   }

  //   async unLikeArticle(likesDto: LikesDto): Promise<string> {
  //     const result = await this.likesRepository.unLikeArticle(likesDto);

  //     if (result.affected === 0) {
  //       throw new NotFoundException(`permission denied`);
  //     } else {
  //       return 'unliked this article';
  //     }
  //   }
}
