import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repositories/user.repository';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { FollowRepository } from './repositories/follow.repository';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [TypeOrmModule.forFeature([FollowRepository, UserRepository])]
})
export class FollowModule { }
