import { Body, Controller, Delete, Get, Headers, HttpCode, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
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
    async login(@Body() loginDto: LoginDto) {
        return this.usersService.login(loginDto);
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    logout(@Body('user') id: number) {
        return this.usersService.logout(id);
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

    @Post('/login/kakao')
    @HttpCode(200)
    getToken(@Body('code') code: string) {
        return this.usersService.getTokenKakao(code);
    }

    @Get('/userinfo')
    getUserInfo(@Query('id') id: number): Promise<object> {
        return this.usersService.getMypage(id);
    }

    @Patch('/profile')
    @UseGuards(AuthGuard)
    modifyProfile(@Body() userData: UpdateUserDto) {
        return this.usersService.modifyUser(userData);
    }

    @Delete('/withdrawal')
    @UseGuards(AuthGuard)
    deleteUser(@Query('user') id: string) {
        return this.usersService.deleteUser(+id);
    }

    @Get('/auth')
    requestRefreshToken(
        @Query('user') id: string,
        @Query('loginmethod') loginMethod: string,
        @Headers('authorization') refreshToken: string
        ) {
        return this.usersService.getRefreshToken(+id, +loginMethod, refreshToken);
    }
}
