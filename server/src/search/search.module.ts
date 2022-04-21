import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from 'src/articles/articles.service';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { TagHitsRepository } from 'src/articles/repositories/tagHits.repository';
import { TrackRepository } from 'src/articles/repositories/track.repository';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleRepository, 
      ArticleToTagRepository, 
      TagRepository, 
      UserRepository,
      TrackRepository,
      FollowRepository,
      LikesRepository,
      TagHitsRepository])
  ],
  controllers: [SearchController],
  providers: [SearchService, ArticlesService]
})
export class SearchModule {}
