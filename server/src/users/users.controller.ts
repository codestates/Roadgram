import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('/login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const info = await this.usersService.login(loginDto);
        res.cookie('refreshToken', info.refreshToken).send(info.data);
    }

    @Post('/logout')
    @HttpCode(200)
    logout(@Res() res: Response) {
        res.cookie("refreshToken", null).send({ message: "logout succeed" })
    }

    @Post('/signup')
    @HttpCode(201)
    signup(@Body() createUserDto: CreateUserDto) {
        return this.usersService.signup(createUserDto)
    }

    @Post('/emailcheck')
    @HttpCode(200)
    checkEmail(@Body('email') email: string) {
        return this.usersService.checkEmail(email)
    }

    @Post('/nicknamecheck')
    @HttpCode(200)
    checkNickname(@Body('nickName') nickname: string) {
        return this.usersService.checkNickname(nickname);
    }

    // @Get('/login/kakao')
    // getToken(@Query('code') code: string) {
    //     return this.usersService.getTokenKakao(code);
    // }

    // @Get('/kakao/callback')
    // @HttpCode(200)
    // getUserInfoKakao(@Req() req){
    //     console.log('hi')
    //     return this.usersService.kakaoCallback(req.user)
    // }


    @Get('/userinfo')
    getUserInfo() {
        return 'abc'
    }

    @Patch('/profile')
    modifyProfile(@Body() userData: UpdateUserDto) {
        return this.usersService.modifyUser(userData);
    }

    @Delete('/withdrawal')
    deleteUser(@Query('id') id: string) {
        return this.usersService.deleteUser(+id);
    }
}
