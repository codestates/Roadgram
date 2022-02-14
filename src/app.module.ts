import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticlesModule } from './articles/articles.module';
import { SearchModule } from './search/search.module';
import { CommentsModule } from './comments/comments.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';
import { typeORMConfig } from 'config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    ArticlesModule,
    SearchModule,
    CommentsModule,
    LikeModule,
    FollowModule
  ],
})
export class AppModule { }
