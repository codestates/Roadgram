import { Body, Controller, Delete, Get, HttpCode, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ValidationTypes } from 'class-validator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';

@Controller('articles')
export class ArticlesController {
  constructor(
    private articlesService: ArticlesService,
  ) { }

  @Get()
  @UseGuards(AuthGuard)
  getMain(
    @Query('user', ParseIntPipe) user: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.articlesService.getMain(user, page);
  }

  @Get('/recent')
  getRecent(
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.articlesService.getRecent(page);
  }

  @Get('/detail')
  getDetail(
    @Query('id', ParseIntPipe) id: number,
    @Query('user', ParseIntPipe) user: number): Promise<object> {
    return this.articlesService.getArticleDetail(id, user);
  }

  @Post()
  @UseGuards(AuthGuard)
  createArticle(@Body() createArticleDto: CreateArticleDto): any {
    const result = this.articlesService.createArticle(createArticleDto);
    return result
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateArticle(@Body() updateArticleDto: UpdateArticleDto): Promise<object> {
    return this.articlesService.updateArticle(updateArticleDto)
  }

  @Delete()
  @UseGuards(AuthGuard)
  deleteArticle(
    @Query('id', ParseIntPipe) id: number
  ): Promise<object> {
    return this.articlesService.deleteArticle(id);
  }


}
