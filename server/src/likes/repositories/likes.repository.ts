import { EntityRepository, Repository } from 'typeorm';
import { LikesDto } from '../dto/likes.dto';
import { Likes } from '../entities/likes.entity';

@EntityRepository(Likes)
export class LikesRepository extends Repository<Likes> {
  //   async likeUnlike(likesDto: LikesDto): Promise<Likes> {
  //     const { userId, articleId } = likesDto;
  //     const likeOrNot = await this.findOne({
  //       user_id: userId,
  //       article_id: articleId,
  //     });
  //     console.log(likeOrNot);
  //     if (likeOrNot === undefined) {
  //       const liked = this.create({
  //         user_id: userId,
  //         article_id: articleId,
  //       });
  //       await this.save(liked);
  //       return liked;
  //     } else {
  //       const unliked = this.delete({
  //         user_id: userId,
  //         article_id: articleId,
  //       });
  //       return;
  //     }
  //   }
}
