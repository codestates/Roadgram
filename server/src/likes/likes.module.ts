import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesRepository } from './repositories/likes.repository';

@Module({
  providers: [LikesService],
  controllers: [LikesController],
  imports: [TypeOrmModule.forFeature([LikesRepository])],
})
export class LikesModule {}
