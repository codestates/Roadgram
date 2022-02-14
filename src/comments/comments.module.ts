import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './repositories/comment.repository';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports:[TypeOrmModule.forFeature([CommentRepository])]
})
export class CommentsModule {}
