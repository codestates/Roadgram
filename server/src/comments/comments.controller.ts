import { Body, Controller, Post, Patch, Delete, HttpCode, Query, UseGuards, ParseIntPipe, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotAcceptableResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto, ModifyCommentDto } from './dto/comments.dto';
import { CreateComment404Response, CreateCommentResponse } from './response/createComment.response';
import { DeleteComment404Response, DeleteCommentResponse } from './response/deleteComment.response';
import { GetComments404Response, GetComments406Response, GetCommentsResponse } from './response/getComments.response';
import { ModifyCommentResponse } from './response/modifyComment.response';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @ApiOperation({summary: "댓글 저장", description: "작성한 댓글을 저장한다."})
  @ApiCreatedResponse({description: "댓글이 정상적으로 저장됨", type: CreateCommentResponse})
  @ApiNotFoundResponse({description: "게시물이 존재하지 않음", type: CreateComment404Response})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): object {
    return this.commentsService.createComment(createCommentDto);
  }

  @Patch()
  @ApiOperation({summary: "댓글 수정", description: "수정한 댓글을 저장한다."})
  @ApiOkResponse({description: "댓글이 정상적으로 수정됨", type: ModifyCommentResponse})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  modifyComment(@Body() modifyCommentDto: ModifyCommentDto): Promise<object> {
    return this.commentsService.modifyComment(modifyCommentDto);
  }

  @Delete()
  @ApiOperation({summary: "댓글 삭제", description: "댓글을 삭제한다."})
  @ApiOkResponse({description: "댓글이 정상적으로 삭제됨", type: DeleteCommentResponse})
  @ApiNotFoundResponse({description: "삭제할 댓글이 존재하지 않음", type: DeleteComment404Response})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  deleteComment(
    @Query('commentId', ParseIntPipe) commentId: number,
    @Query('articleId', ParseIntPipe) articleId: number
  ): Promise<object> {
    return this.commentsService.deleteComment(commentId, articleId);
  }

  @Get()
  @ApiOperation({summary: "게시물 댓글창 조회", description: "특정 게시물의 댓글들을 조회한다"})
  @ApiOkResponse({description: "게시물 댓글창이 정상적으로 조회됨", type: GetCommentsResponse})
  @ApiNotFoundResponse({description: "생성된 댓글이 없음", type: GetComments404Response})
  @ApiNotAcceptableResponse({description: "사용 불가능한 페이지 쿼리", type: GetComments406Response})
  getComments(
    @Query('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.commentsService.getComments(id, page);
  }
}
