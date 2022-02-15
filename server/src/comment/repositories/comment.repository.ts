import { EntityRepository, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto, ModifyCommentDto } from '../dto/comments.dto';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { userId, articleId, comment } = createCommentDto;

    const content = this.create({
      user_id: userId,
      article_id: articleId,
      comment,
    });

    await this.save(content);

    return content;
  }

  async modifyComment(modifyCommentDto: ModifyCommentDto): Promise<Comment> {
    const { commentId, comment } = modifyCommentDto;

    this.update({ id: commentId }, { comment });

    const newContent = await this.findOne(
      { id: commentId },
      { relations: ['user'] },
    );
    return newContent;
  }
}

// relations 테이블의 특정 필드 값만 되돌려주는 장치 필요
