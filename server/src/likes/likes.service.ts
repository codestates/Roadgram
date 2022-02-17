import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { LikesDto } from './dto/likes.dto';
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
    const { user, articleId } = likesDto;
    const likeOrNot = await this.likesRepository.likeOrNot(likesDto);

    if (likeOrNot === undefined) {
      const result = await this.likesRepository.likeArticle(likesDto);
      const total_likes = await this.articleRepository.likeIncrement(articleId);
      return {
        data: {
          articleId: articleId,
          totalLike: total_likes
        },
        message: result
      }
    } else {
      const result = await this.likesRepository.unlikeArticle(likesDto);
      const total_likes = await this.articleRepository.likeDecrement(articleId);
      return {
        data: {
          articleId: articleId,
          totalLike: total_likes
        },
        message: result
      }
    }
  }
}
