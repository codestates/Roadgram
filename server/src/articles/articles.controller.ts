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
  @HttpCode(200)
  getMain(
    @Query('user', ParseIntPipe) user: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.articlesService.getMain(user, page);
  }

  @Get('/recent')
  @HttpCode(200)
  getRecent(
    @Query('page', ParseIntPipe) page: number
  ): Promise<object> {
    return this.articlesService.getRecent(page);
  }

  @Get('/detail')
  @HttpCode(200)
  getDetail(
    @Query('id', ParseIntPipe) id: number,
    @Query('user') user?: number
  ): Promise<object> {
    return this.articlesService.getArticleDetail(id, user);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  createArticle(@Body() createArticleDto: CreateArticleDto): Promise<object> {
    const result = this.articlesService.createArticle(createArticleDto);
    return result
  }

  @Patch()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  updateArticle(@Body() updateArticleDto: UpdateArticleDto): Promise<object> {
    return this.articlesService.updateArticle(updateArticleDto)
  }

  @Delete()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  deleteArticle(
    @Query('id', ParseIntPipe) id: number
  ): Promise<object> {
    return this.articlesService.deleteArticle(id);
  }
}
