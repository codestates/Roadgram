import { EntityRepository, Repository } from 'typeorm';
import { Comments } from '../entities/comments.entity';
import { CreateCommentDto, ModifyCommentDto } from '../dto/comments.dto';

@EntityRepository(Comments)
export class CommentRepository extends Repository<Comments> {
  async createComment(createCommentDto: CreateCommentDto): Promise<object> {
    const { user, articleId, comment } = createCommentDto;

    const newComment = this.create({
      userId: user,
      articleId: articleId,
      comment,
    });
    await this.save(newComment);

    const commentInfo = await this.findOne(newComment.id, { select: ["id", "comment", "createdAt", "updatedAt"] });

    return commentInfo;
  }

  async getComments(articleId: number): Promise<Comments|undefined> {
    const result = await this.find({articleId});
    return result[0]
  }
}