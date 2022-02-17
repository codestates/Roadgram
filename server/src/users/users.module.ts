import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, ArticleRepository]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    HttpModule
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
