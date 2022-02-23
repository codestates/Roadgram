import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesRepository } from './repositories/likes.repository';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { FollowRepository } from 'src/follow/repositories/follow.repository';

@Module({
  providers: [LikesService, UsersService],
  controllers: [LikesController],
  imports: [
    TypeOrmModule.forFeature([
      LikesRepository, 
      ArticleRepository, 
      UserRepository,
      ArticleToTagRepository,
      TagRepository,
      FollowRepository]),
    JwtModule.register({ secret: process.env.JWT_SECRET })
  ],
})
export class LikesModule {}
