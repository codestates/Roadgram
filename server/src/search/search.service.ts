import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { ArticleRepository } from 'src/articles/repositories/article.repository';

@Injectable()
export class SearchService {
  constructor(
    // @InjectRepository
    private articleRepository: ArticleRepository
  ){}
  
  async searchArticle(tag: string): Promise<Article|any> {
    const result = await this.articleRepository.searchArticle(tag)
    if(!result || result.length === 0) {
      throw new NotFoundException('No Content');
    }
    return {
      data: {
        article: result
      },
      message: 'ok'
    }
  }
}
