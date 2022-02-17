import { Body, Controller, Delete, Get, HttpCode, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';

@Controller('articles')
export class ArticlesController {
  constructor(
    private articlesService: ArticlesService,
  ){}
  
  @Get()
  getMain(
    @Query('user', ParseIntPipe) user: number, 
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number
  ): Promise<object> {
    return this.articlesService.getMain(user, page, pageSize);
  }

  @Get('/recent')
  getRecent(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number
  ): Promise<object>{
    return this.articlesService.getRecent(page, pageSize);
  }

  @Get('/detail')
  getDetail(
    @Query('id', ParseIntPipe) id: number,
    @Query('user', ParseIntPipe) user: number): Promise<object>{
    return this.articlesService.getArticleDetail(id, user);
  }

  @Post()
  createArticle(@Body() createArticleDto: CreateArticleDto): any{
    const result = this.articlesService.createArticle(createArticleDto);
    return result
  }

  @Patch()
  updateArticle(@Body() updateArticleDto: UpdateArticleDto): Promise<object> {
    return this.articlesService.updateArticle(updateArticleDto)
  }

  @Delete()
  deleteArticle(
    @Query('id', ParseIntPipe) id: number, 
    @Query('user', ParseIntPipe) user: number,
    @Query('loginmethod', ParseIntPipe) loginmethod: number
  ): Promise<object> {
    return this.articlesService.deleteArticle(id, user, loginmethod);
  }

  
}
