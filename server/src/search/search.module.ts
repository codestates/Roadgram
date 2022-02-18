import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleRepository, ArticleToTagRepository, TagRepository, UserRepository])
  ],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
