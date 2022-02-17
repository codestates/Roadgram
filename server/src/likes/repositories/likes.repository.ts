import { EntityRepository, Repository } from 'typeorm';
import { LikesDto } from '../dto/likes.dto';
import { Likes } from '../entities/likes.entity';

@EntityRepository(Likes)
export class LikesRepository extends Repository<Likes> {
    async likeOrNot(likesDto: LikesDto) {
      const { user, articleId } = likesDto;
      return await this.findOne({
        user_id: user,
        article_id: articleId,
      });
    };

    async likeArticle(likesDto: LikesDto): Promise<string> {
      const { user, articleId } = likesDto;
      const newLike = this.create({
        user_id: user,
        article_id: articleId
      });
      await this.save(newLike);
      return 'like success';
    };

    async unlikeArticle(likesDto: LikesDto): Promise<string> {
      const { user, articleId } = likesDto;
      await this.delete({
        user_id: user,
        article_id: articleId,
      });
      return 'like cancelled';
      }
}
