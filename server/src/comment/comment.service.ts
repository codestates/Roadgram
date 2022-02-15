import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './repositories/comment.repository';
import { CreateCommentDto, ModifyCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentRepository.createComment(createCommentDto);
  }

  modifyComment(modifyCommentDto: ModifyCommentDto): Promise<Comment> {
    // const { commentId, comment } = modifyCommentDto;
    return this.commentRepository.modifyComment(modifyCommentDto);
  }

  async deleteComment(id: number): Promise<string> {
    const result = await this.commentRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`permission denied`);
    } else {
      return 'comment deleted';
    }
  }
}
