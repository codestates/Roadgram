import { EntityRepository, Repository } from 'typeorm';
import { LikesDto } from '../dto/likes.dto';
import { Likes } from '../entities/likes.entity';

@EntityRepository(Likes)
export class LikesRepository extends Repository<Likes> {
    async likeOrNot(user, articleId) {
      if (user === undefined) {
        return false;
      } else {
        const result =  await this.findOne({
          userId: user,
          articleId: articleId,
        });
        return Boolean(result);
      }
    };

    async likeArticle(likesDto: LikesDto): Promise<string> {
      const { user, articleId } = likesDto;
      const newLike = this.create({
        userId: user,
        articleId: articleId
      });
      await this.save(newLike);
      return 'like this post';
    };

    async unlikeArticle(likesDto: LikesDto): Promise<string> {
      const { user, articleId } = likesDto;
      await this.delete({
        userId: user,
        articleId: articleId,
      });
      return 'unlike this post';
    };

    async articleIdsByUserId(id:number){
      const articles=await this.find({userId:id});
      return articles.map(article=>article.articleId);
    }
}
