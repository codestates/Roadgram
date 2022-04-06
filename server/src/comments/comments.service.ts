import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './repositories/comments.repository';
import { CreateCommentDto, ModifyCommentDto } from './dto/comments.dto';
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

  async createComment(createCommentDto: CreateCommentDto): Promise<any> {
    const { user, articleId } = createCommentDto;
    const commentInfo = await this.commentRepository.createComment(createCommentDto);
    const totalComments = await this.articleRepository.commentIncrement(articleId);
    const writerInfo = await this.userRepository.getCommentWriterInfo(user);

    if (totalComments === undefined) {
      throw new NotFoundException('the article does not exist');
    } else if (writerInfo === undefined) {
      throw new NotFoundException('the writer does not exist');
    } else {
      return {
        data: { 
          commentInfo,
          totalComments,
          writerInfo
        },
        message: 'comment created'
      };
    }
  }

  // Nightmare
  async modifyComment(modifyCommentDto: ModifyCommentDto): Promise<object> {
    const { commentId, comment } = modifyCommentDto;
    await this.commentRepository.update({ id: commentId }, { comment });
    const updatedComment = await this.commentRepository.findOne(commentId, { select: ["id", "userId", "comment", "createdAt", "updatedAt"] });
  
    return {
      data: updatedComment,
      message: 'comment modified'
    }
  }

  async deleteComment(commentId: number, articleId: number): Promise<any> {
    const result = await this.commentRepository.delete(commentId);
    const totalComments = await this.articleRepository.commentDecrement(articleId);
  
    if (result.affected === 0) {
      throw new NotFoundException('the commment did not exist')
    } else if (totalComments === undefined) {
      throw new NotFoundException('the article does not exist')
    } else {
      return {
        data: { totalComments: totalComments },
        message: 'comment deleted'
      }
    }
  }

  async getComments(articleId: number, page: number): Promise<any> {
    let limit: number = 10;
    let offset: number = (page - 1) * 10;
    const comments = await this.commentRepository.getComments(articleId, limit, offset);

    if (page <= 0) throw new NotAcceptableException('unavailable page query');
    if (!comments.length) throw new NotFoundException('no comments yet');
    if (comments.length > 10) throw new NotAcceptableException('got more than 10 comments');

    const commentsList = await Promise.all(
      comments.map(async (comment) => {
        const commentUserInfo = await this.userRepository.getUserInfo(comment.userId);
        
        return {
          id: comment.id,
          userId: comment.userId,
          profileImage: commentUserInfo.profileImage,
          nickname: commentUserInfo.nickname,
          comment: comment.comment,
          createdAt: comment.createdAt
        };
      })
    )

    return {
      data: commentsList,
      message: `all comments of article Id: ${articleId}`
    };
  }
}
