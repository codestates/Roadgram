import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesRepository } from './repositories/likes.repository';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [LikesService, UsersService],
  controllers: [LikesController],
  imports: [
    TypeOrmModule.forFeature([LikesRepository, ArticleRepository, UserRepository]),
    JwtModule.register({ secret: process.env.JWT_SECRET })
  ],
})
export class LikesModule {}
