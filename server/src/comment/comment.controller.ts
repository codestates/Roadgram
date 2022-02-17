import { Headers, Body, Controller, Post, Patch, Delete, HttpCode } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CreateCommentDto, ModifyCommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @HttpCode(201)
  createComment(
    //@Headers('authorization')
    @Body() createCommentDto: CreateCommentDto,
  ): object {
    return this.commentsService.createComment(createCommentDto);
  }

  @Patch()
  @HttpCode(200)
  modifyComment(@Body() modifyCommentDto: ModifyCommentDto): Promise<object> {
    return this.commentsService.modifyComment(modifyCommentDto);
  }

  @Delete()
  @HttpCode(200)
  deleteComment(
    @Body('loginMethod') loginMethod: number,
    @Body('commentId') commentId: number,
    @Body('articleId') articleId: number
  ): Promise<object> {
    return this.commentsService.deleteComment(commentId, articleId);
  }
}
