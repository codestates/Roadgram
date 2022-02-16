import { Module } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CommentsController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './repositories/comment.repository';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { UserRepository } from 'src/users/repositories/user.repository';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [TypeOrmModule.forFeature([CommentRepository, ArticleRepository, UserRepository])],
})
export class CommentsModule {}
