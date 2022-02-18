import { EntityRepository, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto, ModifyCommentDto } from '../dto/comment.dto';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { user, articleId, comment } = createCommentDto;

    const newComment = this.create({
      userId: user,
      articleId: articleId,
      comment,
    });
    this.save(newComment);

    return newComment;
  }

  async modifyComment(modifyCommentDto: ModifyCommentDto): Promise<object> {
    const { commentId, comment } = modifyCommentDto;
    return this.update({ id: commentId }, { comment });
  }

  async getComments(articleId: number): Promise<Comment|undefined> {
    const result = await this.find({articleId});
    return result[0]
  }
}
