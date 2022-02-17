import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import axios from 'axios';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { AuthDto } from './dto/auth.dto';
require('dotenv').config();

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(ArticleRepository)
        private articleRepository: ArticleRepository,
        private jwtService: JwtService
    ) { }

    async checkEmail(email: string) {
        if (!email) {
            throw new BadRequestException('Bad request')
        }
        const isValid = await this.userRepository.findOne({ email: email });
        if (isValid) {
            throw new ConflictException('not available')
        }
        else return { message: 'availabe' }
    }

    async checkNickname(nickname: string) {
        if (!nickname) {
            throw new BadRequestException('Bad request')
        }
        const isValid = await this.userRepository.findOne({ nickname: nickname });
        if (isValid) {
            throw new ConflictException('not available')
        }
        else return { message: 'availabe' }
    }

    async login(loginDto: LoginDto) {
        const userInfo = await this.userRepository.findOne({
            login_method: 0,
            email: loginDto.email
        })

        if (!userInfo || !await bcrypt.compare(loginDto.password, userInfo.password)) {
            throw new NotFoundException('login fail')
        }
        else {
            const accessToken = this.jwtService.sign({ email: userInfo.email }, { expiresIn: '1h' });
            const refreshToken = this.jwtService.sign({ email: userInfo.email }, { expiresIn: '12h' });
            this.userRepository.putRefreshToken(userInfo.id, refreshToken);
            return {
                data: {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userInfo: {
                        userId: userInfo.id,
                        nickName: userInfo.nickname
                    }
                },
                message: 'login ok'
            }
        }
    }

    async logout(id: number) {
        this.userRepository.deleteRefreshToken(id);
        return { message: 'logout succeed' };
    }

    signup(createUserDto: CreateUserDto) {
        return this.userRepository.createUser(createUserDto);
    }

    deleteUser(id: number) {
        return this.userRepository.deleteUser(id);
    }

    modifyUser(userData: UpdateUserDto) {
        if (userData.loginMethod !== 0 && userData.password) {
            throw new BadRequestException('bad request');
        }
        else return this.userRepository.updateUser(userData);
    }

    async validateToken(authDto: AuthDto) {
        const { id, loginMethod, accessToken } = authDto;
        const userInfo = await this.userRepository.findOne({ id });
        if (!userInfo) throw new BadRequestException('bad request');
        if (loginMethod === 0) {
            try {
                const tokenInfo = await this.jwtService.verifyAsync(accessToken);
                return tokenInfo.email === userInfo.email;
            } catch {
                throw new UnauthorizedException('request new access token');
            }
        }
        else if (loginMethod === 1) {
            try {
                const userInfoKakao = await axios.get('https://kapi.kakao.com/v2/user/me',
                    { headers: { 'Authorization': `Bearer ${accessToken}` } }
                );
                return userInfoKakao.data.kakao_account.email === userInfo.email;
            } catch {
                throw new UnauthorizedException('request new access token');
            }
        }
    }

    async refreshAccessToken(authDto: AuthDto) {
        const { id, loginMethod, refreshToken } = authDto;
        const userInfo = await this.userRepository.findOne({ id });
        if (!userInfo) {
            throw new BadRequestException('bad request');
        }
        if (userInfo.refresh_token !== refreshToken) {
            throw new ForbiddenException('invalid token');
        }
        if (loginMethod === 0) {
            try {
                await this.jwtService.verifyAsync(refreshToken);
                const accessToken = this.jwtService.sign({ email: userInfo.email }, { expiresIn: '1h' });
                return {
                    data: { accessToken },
                    message: 'new access token'
                }
            } catch {
                this.userRepository.deleteRefreshToken(id);
                throw new UnauthorizedException('refresh token expired');
            }
        }
        else if (loginMethod === 1) {
            try {
                const tokenRequest = await axios.post(`https://kauth.kakao.com/oauth/token?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&refresh_token=${refreshToken}`,
                    { headers: { 'Content-Type': "application/x-www-form-urlencoded" } }
                );
                return {
                    data: { accessToken: tokenRequest.data.access_token },
                    message: 'new access token'
                }
            } catch {
                this.userRepository.deleteRefreshToken(id);
                throw new UnauthorizedException('refresh token expired');
            }
        }

    }

    async getTokenKakao(code: string) {
        try {
            const tokenRequest = await axios.post(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3000&code=${code}`,
                { headers: { 'Content-Type': "application/x-www-form-urlencoded" } }
            );
            const userInfoKakao = await axios.get('https://kapi.kakao.com/v2/user/me',
                {
                    headers: {
                        'Authorization': `Bearer ${tokenRequest.data.access_token}`
                    }
                }
            );
            const userInfo = await this.userRepository.findOne({ email: userInfoKakao.data.kakao_account.email });
            if (!userInfo) {
                const user = {
                    email: userInfoKakao.data.kakao_account.email,
                    nickname: null,
                    password: null,
                    login_method: 1,
                    refresh_token: tokenRequest.data.refresh_token
                }
                const createdUserInfo = await this.userRepository.save(user);
                return {
                    data: {
                        accessToken: tokenRequest.data.access_token,
                        refreshToken: tokenRequest.data.refresh_token,
                        userInfo: {
                            userId: createdUserInfo.id,
                            nickname: createdUserInfo.nickname,
                            loginMethod: 1
                        }
                    },
                    message: 'signup successfully'
                }
            }
            else {
                await this.userRepository.putRefreshToken(userInfo.id, tokenRequest.data.refresh_token);
                return {
                    data: {
                        accessToken: tokenRequest.data.access_token,
                        refreshToken: tokenRequest.data.refresh_token,
                        userInfo: {
                            userId: userInfo.id,
                            nickname: userInfo.nickname,
                            loginMethod: 1
                        }
                    },
                    message: 'login successfully'
                }
            }
        } catch {
            throw new UnauthorizedException('permission denied');
        }
    }
    async getMypage(id: number): Promise<object> {
        const userInfo = await this.userRepository.getUserInfo(id);
        if(!userInfo || Object.keys(userInfo).length === 0) {
            throw new NotFoundException("No Content")
        }
        const mypageArticle = await this.articleRepository.getMypageArticle(id);
        return {
            data: {
                userInfo,
                article: mypageArticle
            },
            message: "ok"
        }
    }
}
