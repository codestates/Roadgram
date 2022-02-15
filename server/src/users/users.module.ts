import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    HttpModule.registerAsync({
      useFactory: ()=>({
        timeout: 5000,
        maxRedirects: 5
      })
    })
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
