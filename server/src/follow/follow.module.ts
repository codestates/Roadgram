import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersService } from 'src/users/users.service';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { FollowRepository } from './repositories/follow.repository';

@Module({
  controllers: [FollowController],
  providers: [FollowService, UsersService],
  imports: [
    TypeOrmModule.forFeature([
      FollowRepository, 
      UserRepository, 
      ArticleRepository, 
      ArticleToTagRepository,
      TagRepository]),
    JwtModule.register({ secret: process.env.JWT_SECRET })
  ]
})
export class FollowModule { }
