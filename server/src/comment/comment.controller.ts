import { Headers, Body, Controller, Post, Patch, Delete } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto, ModifyCommentDto } from './dto/comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  createComment(
    //@Headers('authorization')
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.createComment(createCommentDto);
  }

  @Patch()
  modifyComment(@Body() modifyCommentDto: ModifyCommentDto): Promise<Comment> {
    return this.commentsService.modifyComment(modifyCommentDto);
  }

  @Delete()
  deleteComment(
    @Body('loginMethod') loginMethod: number,
    @Body('commentId') commentId: number,
  ): Promise<string> {
    return this.commentsService.deleteComment(commentId);
  }
}
