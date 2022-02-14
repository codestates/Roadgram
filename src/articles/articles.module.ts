import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticleRepository } from './repositories/article.repository';
import { ArticlesService } from './articles.service';
import { TagRepository } from './repositories/tag.repository';
import { TrackRepository } from './repositories/track.repository';
import { ArticleToTagRepository } from './repositories/article_tag.repository';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [TypeOrmModule.forFeature([ArticleRepository, TagRepository, TrackRepository, ArticleToTagRepository])]
})
export class ArticlesModule { }
