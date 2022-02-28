import { Body, Controller, Post, Patch, Delete, HttpCode, Query, UseGuards, ParseIntPipe, Get } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto, ModifyCommentDto } from './dto/comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): object {
    return this.commentsService.createComment(createCommentDto);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  modifyComment(@Body() modifyCommentDto: ModifyCommentDto): Promise<object> {
    return this.commentsService.modifyComment(modifyCommentDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  deleteComment(
    @Query('loginMethod', ParseIntPipe) loginMethod: number,
    @Query('commentId', ParseIntPipe) commentId: number,
    @Query('articleId', ParseIntPipe) articleId: number,
    @Query('user', ParseIntPipe) user: number
  ): Promise<object> {
    return this.commentsService.deleteComment(commentId, articleId);
  }

  @Get()
  @HttpCode(200)
  getComments(
    @Query('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.commentsService.getComments(id, page);
  }
}
