import { Body, Controller, Delete, Get, Headers, HttpCode, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { EmailDto, IdDto, KakaoLoginDto, LoginDto, NicknameDto, QueryDto, TokenDto } from './dto/login.dto';
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
    logout(@Body() idDto: IdDto): Promise<object> {
        return this.usersService.logout(idDto);
    }

    @Post('/signup')
    @HttpCode(201)
    signup(@Body() createUserDto: CreateUserDto): Promise<object> {
        return this.usersService.signup(createUserDto)
    }

    @Post('/emailcheck')
    @HttpCode(200)
    checkEmail(@Body() emailDto: EmailDto): Promise<object> {
        return this.usersService.checkEmail(emailDto)
    }

    @Post('/nicknamecheck')
    @HttpCode(200)
    checkNickname(@Body() nicknameDto: NicknameDto): Promise<object> {
        return this.usersService.checkNickname(nicknameDto);
    }

    @Post('/login/kakao')
    @HttpCode(200)
    getToken(@Body() kakaoLoginDto: KakaoLoginDto): Promise<object> {
        return this.usersService.getTokenKakao(kakaoLoginDto);
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
    deleteUser(@Query() idDto: QueryDto): Promise<object> {
        return this.usersService.deleteUser(idDto);
    }

    @Get('/auth')
    @HttpCode(200)
    refreshAccessToken(
        @Query() queryDto: QueryDto,
        @Headers() tokenDto: TokenDto
    ): Promise<object> {
        return this.usersService.refreshAccessToken({ id: +queryDto.user, loginMethod: +queryDto.loginMethod, refreshToken: tokenDto.authroization });
    }
}
