import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createComment(createCommentDto: CreateCommentDto): Promise<object> {
    const { user, articleId, comment } = createCommentDto;
    const commentInfo = await this.commentRepository.createComment(createCommentDto);
    const totalComments = await this.articleRepository.commentIncrement(articleId);
    const writerInfo = await this.userRepository.getCommentWriterInfo(user);

    return {
      data: { 
        commentInfo, 
        totalComments: totalComments,
        writerInfo
      },
      message: 'comment created'
    };
  }

  // Nightmare
  async modifyComment(modifyCommentDto: ModifyCommentDto): Promise<object> {
    const { commentId, comment } = modifyCommentDto;
    await this.commentRepository.update({ id: commentId }, { comment });
    const updatedComment = await this.commentRepository.findOne(commentId, { select: ["id", "userId", "comment", "createdAt", "updatedAt" ] });
    return {
      data: updatedComment,
      message: 'comment modified'
    }
  }

  async deleteComment(commentId: number, articleId: number): Promise<object> {
    const result = await this.commentRepository.delete(commentId);

    if (result.affected === 0) {
      throw new NotFoundException(`permission denied`);
    } else {
      const totalComments = await this.articleRepository.commentDecrement(articleId);
      return {
        data: { totalComments: totalComments },
        message: 'comment deleted'
      }
    }
  }

  async getComments(articleId: number, page: number): Promise<object> {
    let limit: number = 10;
    let offset: number = (page - 1) * 10;
    const comments = await this.commentRepository.getComments(articleId, limit, offset);
    if(!comments.length) throw new NotFoundException('cannot find comments');
    const commentsList = await Promise.all(
      comments.map(async (comment) => {
        const commentUserInfo = await this.userRepository.getUserInfo(
          comment.userId,
        );
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
    if (commentsList.length === 0) {
      return { message: 'No comments' }
    } else {
      return {
        data: commentsList,
        message: 'ok'
      };
    }
  }
}
