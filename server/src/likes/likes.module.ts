import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesRepository } from './repositories/likes.repository';
import { ArticleRepository } from 'src/articles/repositories/article.repository';

@Module({
  providers: [LikesService],
  controllers: [LikesController],
  imports: [TypeOrmModule.forFeature([LikesRepository, ArticleRepository])],
})
export class LikesModule {}
