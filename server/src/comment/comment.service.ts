import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './repositories/comment.repository';
import { CreateCommentDto, ModifyCommentDto } from './dto/comment.dto';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    @InjectRepository(ArticleRepository)
    private articleRepository: ArticleRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<object> {
    const { userId, articleId, comment } = createCommentDto;
    const newComment = await this.commentRepository.createComment(createCommentDto);
    const articleCommentInfo = await this.articleRepository.commentIncrement(articleId);
    const writerInfo = await this.userRepository.getCommentWriterInfo(userId);

    return {
      data: { 
        newComment, 
        articleCommentInfo, 
        writerInfo
      },
      message: 'comment created'
    };
  }

  async modifyComment(modifyCommentDto: ModifyCommentDto): Promise<object> {
    const { commentId, comment } = modifyCommentDto;
    await this.commentRepository.modifyComment(modifyCommentDto);
    const updatedComment = await this.commentRepository.find({where: {id: commentId}});
    return updatedComment;
  }

  async deleteComment(commentId: number, articleId: number): Promise<object> {
    const result = await this.commentRepository.delete(commentId);

    if (result.affected === 0) {
      throw new NotFoundException(`permission denied`);
    } else {
      const articleCommentInfo = await this.articleRepository.commentDecrement(articleId);
      console.log(articleCommentInfo);
      return {
        data: { articleCommentInfo },
        message: 'comment deleted'
      }
    }
  }
}
