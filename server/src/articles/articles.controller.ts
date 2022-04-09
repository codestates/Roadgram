import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { CreateArticle400Response, CreateArticle404Response, CreateArticleResponse } from './response/createArticle.response';
import { DeleteArticle404Response, DeleteArticleResponse } from './response/deleteArticle.response';
import { GetArticleDetail404Response, GetArticleDetailResponse } from './response/getArticleDetail.response';
import { GetMain401Response, GetMain404Response, GetMainResponse } from './response/getMain.response';
import { GetRecent401Response, GetRecent404Response, GetRecentResponse } from './response/getRecent.response';
import { UpdateArticle400Response, UpdateArticle404Response, UpdateArticleResponse } from './response/updateArticle.response';

@Controller('articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(
    private articlesService: ArticlesService,
  ) {}

  @Get()
  @ApiOperation({summary: "메인 페이지 팔로우 조회", description: "메인 페이지에서 팔로우한 사람의 게시물들을 조회한다."})
  @ApiOkResponse({description: '팔로우 게시물을 정상적으로 조회함', type: GetMainResponse})
  @ApiUnauthorizedResponse({description: '권한이 없음', type: GetMain401Response})
  @ApiNotFoundResponse({description: '팔로잉 유저를 찾을 수 없음', type: GetMain404Response})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getMain(
    @Query('user', ParseIntPipe) user: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.articlesService.getMain(user, page);
  }

  @Get('/recent')
  @ApiOperation({summary: "메인 페이지 최신순 조회", description: "메인 페이지에서 모든 게시물들을 최신순으로 조회한다."})
  @ApiOkResponse({description: '최신순으로 게시물을 정상적으로 조회함', type: GetRecentResponse})
  @ApiUnauthorizedResponse({description: '권한이 없음', type: GetRecent401Response})
  @ApiNotFoundResponse({description: '팔로잉 유저를 찾을 수 없음', type: GetRecent404Response})
  getRecent(
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.articlesService.getRecent(page);
  }

  @Get('/detail')
  @ApiOperation({summary: "게시물 상세 조회", description: "특정 게시물의 정보를 상세 조회한다."})
  @ApiOkResponse({description: '게시물 상세정보를 정상적으로 조회함', type: GetArticleDetailResponse})
  @ApiNotFoundResponse({description: `게시물의 상세 정보를 조회할 수 없음`, type: GetArticleDetail404Response})
  getDetail(
    @Query('id', ParseIntPipe) id: number,
    @Query('user') user?: number
  ): Promise<object> {
    return this.articlesService.getArticleDetail(id, user);
  }

  @Post()
  @ApiOperation({summary: "게시물 등록", description: "작성된 게시물을 등록한다."})
  @ApiCreatedResponse({description: '게시물이 정상적으로 등록됨', type: CreateArticleResponse})
  @ApiBadRequestResponse({description: '잘못된 요청', type: CreateArticle400Response})
  @ApiNotFoundResponse({description: `유저 정보를 찾을 수 없음`, type: CreateArticle404Response})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  createArticle(@Body() createArticleDto: CreateArticleDto): Promise<object> {
    return this.articlesService.createArticle(createArticleDto);
  }

  @Patch()
  @ApiOperation({summary: "게시물 수정", description: "게시물을 수정한다."})
  @ApiOkResponse({description: '게시물이 정상적으로 수정됨', type: UpdateArticleResponse})
  @ApiNotFoundResponse({description: `게시물 내용을 찾을 수 없음`, type: UpdateArticle404Response})
  @ApiBadRequestResponse({description: '잘못된 요청으로 작업이 취소됨', type: UpdateArticle400Response})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  updateArticle(@Body() updateArticleDto: UpdateArticleDto): Promise<object> {
    return this.articlesService.updateArticle(updateArticleDto)
  }

  @Delete()
  @ApiOperation({summary: "게시물 삭제", description: "게시물을 삭제한다."})
  @ApiOkResponse({description: '게시물이 정상적으로 삭제됨', type: DeleteArticleResponse})
  @ApiNotFoundResponse({description: '삭제할 게시물을 찾을 수 없음', type: DeleteArticle404Response})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  deleteArticle(
    @Query('id', ParseIntPipe) id: number
  ): Promise<object> {
    return this.articlesService.deleteArticle(id);
  }
}
