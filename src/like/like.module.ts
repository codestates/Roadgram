import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeRepository } from './repositories/like.repository';

@Module({
  providers: [LikeService],
  controllers: [LikeController],
  imports:[TypeOrmModule.forFeature([LikeRepository])]
})
export class LikeModule {}
