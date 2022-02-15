import { Body, Controller, Delete, Get, HttpCode, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}
  
  @Get()
  @HttpCode(200)
  getMain(
    @Query('id', ParseIntPipe) id: number, 
    @Query('loginmethod', ParseIntPipe) loginmethod: number
  ): Promise<object> {
    return this.articlesService.getMain(id, loginmethod);
  }

  @Get('/detail')
  @HttpCode(200)
  getDetail(@Query('id', ParseIntPipe) id: number): Promise<object>{
    return this.articlesService.getArticleDetail(id);
  }

  @Post()
  @HttpCode(201)
  createArticle(@Body() createArticleDto: CreateArticleDto): Promise<object> {
    return this.articlesService.createArticle(createArticleDto);
  }

  @Patch()
  @HttpCode(200)
  updateArticle(@Body() updateArticleDto: UpdateArticleDto): Promise<object> {
    return this.articlesService.updateArticle(updateArticleDto)
  }

  @Delete()
  @HttpCode(200)
  deleteArticle(
    @Query('id', ParseIntPipe) id: number, 
    @Query('loginmethod', ParseIntPipe) loginmethod: number
  ): Promise<object> {
    return this.articlesService.deleteArticle(id, loginmethod);
  }

  
}
