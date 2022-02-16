import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { LikesDto } from './dto/likes.dto';
import { Likes } from './entities/likes.entity';
import { LikesRepository } from './repositories/likes.repository';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesRepository)
    private likesRepository: LikesRepository,
    @InjectRepository(ArticleRepository)
    private articleRepository: ArticleRepository,
  ) {}

  async likeUnlike(likesDto: LikesDto): Promise<object> {
    const { userId, articleId } = likesDto;
    const likeOrNot = await this.likesRepository.likeOrNot(likesDto);

    if (likeOrNot === undefined) {
      const message = await this.likesRepository.likeArticle(likesDto);
      const total_likes = await this.articleRepository.likeIncrement(articleId);
      return {
        data: {
          articleId: articleId,
          totalLike: total_likes
        },
        message: message
      }
    } else {
      const message = await this.likesRepository.unlikeArticle(likesDto);
      const total_likes = await this.articleRepository.likeDecrement(articleId);
      return {
        data: {
          articleId: articleId,
          totalLike: total_likes
        },
        message: message
      }
    }
  }

    // async unLikeArticle(likesDto: LikesDto): Promise<string> {
    //   const result = await this.likesRepository.unLikeArticle(likesDto);

    //   if (result.affected === 0) {
    //     throw new NotFoundException(`permission denied`);
    //   } else {
    //     return 'unliked this article';
    //   }
    // }
}
