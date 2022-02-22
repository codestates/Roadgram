import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailDto, IdDto, KakaoLoginDto, LoginDto, NicknameDto } from './dto/login.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import axios from 'axios';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { AuthDto } from './dto/auth.dto';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { User } from './entities/user.entity';
require('dotenv').config();

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(ArticleRepository)
        private articleRepository: ArticleRepository,
        @InjectRepository(ArticleToTagRepository)
        private articleToTagRepository: ArticleToTagRepository,
        @InjectRepository(TagRepository)
        private tagRepository: TagRepository,
        private jwtService: JwtService
    ) { }

    async checkEmail({ email }: EmailDto) {
        const isValid = await this.userRepository.findOne({ email });
        if (isValid) {
            throw new ConflictException('not available')
        }
        else return { message: 'available' }
    }

    async checkNickname({ nickname }: NicknameDto) {
        const isValid = await this.userRepository.findOne({ nickname });
        if (isValid) {
            throw new ConflictException('not available')
        }
        else return { message: 'available' }
    }

    async login(loginDto: LoginDto) {
        const userInfo = await this.userRepository.findOne({
            loginMethod: 0,
            email: loginDto.email
        })
        if (!userInfo || !await bcrypt.compare(loginDto.password, userInfo.password)) {
            throw new NotFoundException('login fail')
        }
        else {
            const accessToken = this.jwtService.sign({ email: loginDto.email }, { expiresIn: '1h' });
            const refreshToken = this.jwtService.sign({ email: loginDto.email }, { expiresIn: '12h' });
            this.userRepository.putRefreshToken(userInfo.id, refreshToken);
            return {
                data: {
                    accessToken,
                    refreshToken,
                    userInfo: {
                        id: userInfo.id,
                        nickname: userInfo.nickname
                    }
                },
                message: 'login ok'
            }
        }
    }

    async logout(idDto: IdDto) {
        const id = idDto.user;
        try {
            this.userRepository.deleteRefreshToken(id);
            return { message: 'logout succeed' };
        } catch {
            throw new NotFoundException("cannot find user")
        }

    }

    signup(createUserDto: CreateUserDto) {
        return this.userRepository.createUser(createUserDto);
    }

    deleteUser(idDto: IdDto) {
        return this.userRepository.deleteUser(idDto.user);
    }

    modifyUser(userData: UpdateUserDto) {
        if (userData.loginMethod !== 0 && userData.password) {
            throw new BadRequestException('bad request');
        }
        else return this.userRepository.updateUser(userData);
    }

    async validateToken(authDto: AuthDto) {
        console.log("validateToken 시작!!!!!");
        const { id, loginMethod, accessToken } = authDto;
        console.log("authDto", authDto);
        const userInfo = await this.userRepository.findOne({ id, loginMethod });
        if (!userInfo) throw new NotFoundException('cannnot find user');
        if (loginMethod === 0) {
            try {
                const tokenInfo = await this.jwtService.verifyAsync(accessToken);
                console.log("tokenInfo", tokenInfo);
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

    async refreshAccessToken({ id, loginMethod, refreshToken }: AuthDto) {
        const userInfo = await this.userRepository.findOne({ id, loginMethod });
        if (!userInfo) {
            throw new NotFoundException('cannot find user');
        }
        if (userInfo.refreshToken !== refreshToken) {
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

    async getTokenKakao({ code }: KakaoLoginDto) {
        try {
            const tokenRequest = await axios.post(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&code=${code}`,
                { headers: { 'Content-Type': "application/x-www-form-urlencoded" } }
            );
            const userInfoKakao = await axios.get('https://kapi.kakao.com/v2/user/me',
                { headers: { 'Authorization': `Bearer ${tokenRequest.data.access_token}` } }
            );
            const userInfo = await this.userRepository.findOne({ email: userInfoKakao.data.kakao_account.email });
            if (!userInfo) {
                const user: User = this.userRepository.create({
                    email: userInfoKakao.data.kakao_account.email,
                    nickname: null,
                    password: null,
                    loginMethod: 1,
                    refreshToken: tokenRequest.data.refresh_token
                })
                const createdUserInfo = await this.userRepository.save(user);
                return {
                    data: {
                        accessToken: tokenRequest.data.access_token,
                        refreshToken: tokenRequest.data.refresh_token,
                        userInfo: {
                            id: createdUserInfo.id,
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
                            id: userInfo.id,
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

    async getMypage(user: number, page: number): Promise<object> {
        try {
            let limit: number = 9;
            let offset: number = (page - 1) * 9;
            const userInfo = await this.userRepository.getUserInfo(user);
            const articles = await this.articleRepository.getArticleInfo(user, limit, offset);
            console.log("usersInfo ===", userInfo);
            console.log("articles ===", articles);

            // // 각 게시물에 태그 이름(배열) 추가
            let newArticles = [];
            for (const article of articles) {
                const tagIds: object = await this.articleToTagRepository.getTagIds(article.id);
                const tagNames: string[] = await this.tagRepository.getTagNameWithIds(tagIds);
                article.tags = tagNames;

                interface articleObject {
                    id: string,
                    thumbnail: string,
                    nickname: string
                    totalLike: number,
                    totalComment: number,
                    tags: string[]
                }
                let creation: articleObject = {
                    id: article.id,
                    thumbnail: article.thumbnail,
                    nickname: userInfo.nickname,
                    totalLike: article.totalLike,
                    totalComment: article.totalComment,
                    tags: article.tags
                };
                newArticles.push(creation);
            }
            return {
                data: {
                    userInfo: {
                        id: userInfo.id,
                        email: userInfo.email,
                        nickname: userInfo.nickname,
                        statusMessage: userInfo.statusMessage,
                        profileImage: userInfo.profileImage,
                        totalFollower: userInfo.totalFollower,
                        totalFollowing: userInfo.totalFollowing
                    },
                    articles: newArticles
                },
                message: "ok"
            }
        } catch (err) {
            console.error(err);
            throw new NotFoundException("No Content")
        }
    }
}
