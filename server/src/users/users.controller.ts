import { Body, Controller, Delete, Get, Headers, HttpCode, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('/login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto): Promise<object> {
        return this.usersService.login(loginDto);
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    logout(@Body('user') id: number): Promise<object> {
        return this.usersService.logout(id);
    }

    @Post('/signup')
    @HttpCode(201)
    signup(@Body() createUserDto: CreateUserDto): Promise<object> {
        return this.usersService.signup(createUserDto)
    }

    @Post('/emailcheck')
    @HttpCode(200)
    checkEmail(@Body('email') email: string): Promise<object> {
        return this.usersService.checkEmail(email)
    }

    @Post('/nicknamecheck')
    @HttpCode(200)
    checkNickname(@Body('nickname') nickname: string): Promise<object> {
        return this.usersService.checkNickname(nickname);
    }

    @Post('/login/kakao')
    @HttpCode(200)
    getToken(@Body('code') code: string): Promise<object> {
        return this.usersService.getTokenKakao(code);
    }

    @Get('/userinfo')
    getUserInfo(
        @Query('user') user: number,
        @Query('page') page: number,
    ): Promise<object> {
        return this.usersService.getMypage(user, page);
    }

    @Patch('/profile')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    modifyProfile(@Body() userData: UpdateUserDto): Promise<object> {
        return this.usersService.modifyUser(userData);
    }

    @Delete('/withdrawal')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    deleteUser(@Query('user') id: string): Promise<object> {
        return this.usersService.deleteUser(+id);
    }

    @Get('/auth')
    @HttpCode(200)
    refreshAccessToken(
        @Query('user') id: string,
        @Query('loginMethod') loginMethod: string,
        @Headers('authorization') refreshToken: string
    ): Promise<object> {
        return this.usersService.refreshAccessToken({ id: +id, loginMethod: +loginMethod, refreshToken });
    }
}
