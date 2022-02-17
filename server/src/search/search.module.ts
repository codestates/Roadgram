import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleRepository])
  ],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
