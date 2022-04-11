import { Body, Controller, Delete, Get, Headers, HttpCode, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { EmailDto, IdDto, KakaoLoginDto, LoginDto, NicknameDto, QueryDto, TokenDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CheckEmail409Response, CheckEmailResponse } from './response/checkEmail.response';
import { CheckNickname409Response, CheckNicknameResponse } from './response/checkNickname.response';
import { DeleteUserResponse } from './response/deleteUser.response';
import { GetMypage404Response, GetMypageResponse } from './response/getMypage.response';
import { GetTokenKaKao401Response, GetTokenKaKaoResponse } from './response/getTokenKakao.response';
import { Login404Response, LoginResponse } from './response/login.response';
import { Logout404Response, LogoutResponse } from './response/logout.response';
import { RefreshAccessToken401Response, RefreshAccessToken403Response, RefreshAccessToken404Response, RefreshAccessTokenResponse } from './response/refreshAccessToken.response';
import { SignupResponse } from './response/signup.response';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('/login')
    @ApiOperation({summary: "로그인", description: "입력한 ID / PW로 로그인을 시도한다."})
    @ApiOkResponse({description: "로그인 성공", type: LoginResponse})
    @ApiNotFoundResponse({description: "로그인 실패", type: Login404Response})
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto): Promise<object> {
        return this.usersService.login(loginDto);
    }

    @Post('/logout')
    @ApiOperation({summary: "로그아웃", description: "로그아웃을 시도한다."})
    @ApiOkResponse({description: "로그아웃 성공", type: LogoutResponse})
    @ApiNotFoundResponse({description: "로그아웃 실패", type: Logout404Response})
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    logout(@Body() idDto: IdDto): Promise<object> {
        return this.usersService.logout(idDto);
    }

    @Post('/signup')
    @ApiOperation({summary: "회원가입", description: "입력한 정보로 회원가입을 요청한다."})
    @ApiOkResponse({description: "회원가입 성공", type: SignupResponse})
    @HttpCode(201)
    signup(@Body() createUserDto: CreateUserDto): Promise<object> {
        return this.usersService.signup(createUserDto)
    }

    @Post('/emailcheck')
    @ApiOperation({summary: "이메일 유효성 확인", description: "입력한 이메일의 유효성을 확인한다."})
    @ApiOkResponse({description: "이메일 유효성 확인 성공", type: CheckEmailResponse})
    @ApiConflictResponse({description: "이메일 유효성 확인 실패", type: CheckEmail409Response})
    @HttpCode(200)
    checkEmail(@Body() emailDto: EmailDto): Promise<object> {
        return this.usersService.checkEmail(emailDto)
    }

    @Post('/nicknamecheck')
    @ApiOperation({summary: "닉네임 유효성 확인", description: "입력한 닉네임의 유효성을 확인한다."})
    @ApiOkResponse({description: "닉네임 유효성 확인 성공", type: CheckNicknameResponse})
    @ApiConflictResponse({description: "닉네임 유효성 확인 실패", type: CheckNickname409Response})
    @HttpCode(200)
    checkNickname(@Body() nicknameDto: NicknameDto): Promise<object> {
        return this.usersService.checkNickname(nicknameDto);
    }

    @Post('/login/kakao')
    @ApiOperation({summary: "카카오 회원가입/로그인", description: "카카오 회원가입/로그인을 시도한다."})
    @ApiOkResponse({description: "카카오 회원가입/로그인 성공", type: GetTokenKaKaoResponse})
    @ApiUnauthorizedResponse({description: "카카오 회원가입/로그인 성공", type: GetTokenKaKao401Response})
    @HttpCode(200)
    getToken(@Body() kakaoLoginDto: KakaoLoginDto): Promise<object> {
        return this.usersService.getTokenKakao(kakaoLoginDto);
    }

    @Get('/userinfo')
    @ApiOperation({summary: "유저 마이페이지 정보 조회", description: "유저의 마이페이지 정보를 조회한다."})
    @ApiOkResponse({description: "유저 마이페이지 정보 조회 성공", type: GetMypageResponse})
    @ApiNotFoundResponse({description: "유저 마이페이지 정보 조회 실패", type: GetMypage404Response})
    getUserInfo(
        @Query('user') user: number,
        @Query('page') page: number,
        @Query('other') other?: number
    ): Promise<object> {
        return this.usersService.getMypage(page, user, other);
    }

    @Patch('/profile')
    @ApiOperation({summary: "유저 정보 수정", description: "입력된 정보로 유저 정보를 수정한다."})
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    modifyProfile(@Body() userData: UpdateUserDto): Promise<object> {
        return this.usersService.modifyUser(userData);
    }

    @Delete('/withdrawal')
    @ApiOperation({summary: "회원 탈퇴", description: "회원 탈퇴를 시도한다."})
    @ApiOkResponse({description: "회원 탈퇴 성공", type: DeleteUserResponse})
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    deleteUser(@Query() idDto: QueryDto): Promise<object> {
        return this.usersService.deleteUser(idDto);
    }

    @Get('/auth')
    @ApiOperation({summary: "토큰 확인", description: "refresh / access token 정보를 확인 및 발급한다."})
    @ApiOkResponse({description: "액세스 토큰 발급 완료", type: RefreshAccessTokenResponse})
    @ApiNotFoundResponse({description: "유저 정보를 찾을 수 없음", type: RefreshAccessToken404Response})
    @ApiUnauthorizedResponse({description: "리프레시 토큰 만료", type: RefreshAccessToken403Response})
    @ApiForbiddenResponse({description: "유효하지 않은 리프레시 토큰", type: RefreshAccessToken401Response})
    @HttpCode(200)
    refreshAccessToken(
        @Query() queryDto: QueryDto,
        @Headers() tokenDto: TokenDto
    ): Promise<object> {
        return this.usersService.refreshAccessToken({ id: +queryDto.user, loginMethod: +queryDto.loginMethod, refreshToken: tokenDto.authorization });
    }
}
