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
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { CommentRepository } from 'src/comments/repositories/comments.repository';
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
        @InjectRepository(FollowRepository)
        private followRepository: FollowRepository,
        @InjectRepository(LikesRepository)
        private likesRepository: LikesRepository,
        @InjectRepository(CommentRepository)
        private commentsRepository: (CommentRepository),
        private jwtService: JwtService
    ) { }

    async checkEmail({ email }: EmailDto): Promise<object> {
        const isValid = await this.userRepository.findOne({ email });
        if (isValid && isValid.email === email) {
            throw new ConflictException('not available')
        }
        else return { message: 'available' }
    }

    async checkNickname({ nickname }: NicknameDto): Promise<object> {
        const isValid = await this.userRepository.findOne({ nickname });
        if (isValid && isValid.nickname === nickname) {
            throw new ConflictException('not available')
        }
        else return { message: 'available' }
    }

    async login(loginDto: LoginDto): Promise<any> {
        const userInfo = await this.userRepository.findOne({
            loginMethod: 0,
            email: loginDto.email
        })
        if (!userInfo || !await bcrypt.compare(loginDto.password, userInfo.password)) {
            throw new NotFoundException('login fail')
        }
        else {
            const accessToken = this.jwtService.sign({ email: loginDto.email }, { expiresIn: '12h' });
            const refreshToken = this.jwtService.sign({ email: loginDto.email }, { expiresIn: '720h' });
            this.userRepository.putRefreshToken(userInfo.id, refreshToken);
            return {
                data: {
                    accessToken,
                    refreshToken,
                    userInfo: {
                        id: userInfo.id,
                        nickname: userInfo.nickname,
                        loginMethod: userInfo.loginMethod,
                        profileImage: userInfo.profileImage
                    }
                },
                message: 'login ok'
            }
        }
    }

    async logout(idDto: IdDto) {
        this.userRepository.deleteRefreshToken(idDto.user);
        return { message: 'logout succeed' };
    }

    async signup(createUserDto: CreateUserDto): Promise<object> {
        await this.userRepository.createUser(createUserDto);
        return { message: "signup succeed" };
    }

    async deleteUser(idDto: IdDto): Promise<object> {
        const id: number = idDto.user;
        this.userRepository.deleteUser(id);// 일단 유저 삭제
        const followers = await this.followRepository.getFollowingIds(id);// 팔로우 한 사람들 아이디
        const followings = await this.followRepository.getFollowedIds(id);// 팔로잉 한 사람들 아이디
        const likes = await this.likesRepository.articleIdsByUserId(id);// 좋아요 누른 아티클 아이디
        const comments = await this.commentsRepository.getCommentsByUserId(id);// 댓글 단 아티클 아이디
        // 각각 forEach 함수로 하나 당 하나 씩 숫자 감소 시키기
        await Promise.all(
            followers.map(async (followerId) => {
                const follower = await this.userRepository.findOne({ id: followerId });
                this.userRepository.update({ id: followerId }, { totalFollower: follower.totalFollower - 1 });
            })
        )
        await Promise.all(
            followings.map(async (followingId) => {
                const following = await this.userRepository.findOne({ id: followingId });
                this.userRepository.update({ id: followingId }, { totalFollowing: following.totalFollowing - 1 });
            })
        )
        await Promise.all(
            likes.map(async (articleId) => {
                const article = await this.articleRepository.findOne({ id: articleId });
                this.articleRepository.update({ id: articleId }, { totalLike: article.totalLike - 1 });
            })
        )
        await Promise.all(
            comments.map(async (articleId) => {
                const article = await this.articleRepository.findOne({ id: articleId });
                this.articleRepository.update({ id: articleId }, { totalComment: article.totalComment - 1 });
            })
        )
        return { message: 'withdrawal succeed' };
    }

    async modifyUser(userData: UpdateUserDto): Promise<object> {
        if (userData.loginMethod !== 0 && userData.password) {
            throw new BadRequestException('social login user cannot change password');
        }
        else {
            const userInfo = await this.userRepository.updateUser(userData);
            return {
                data: {
                    userInfo
                },
                message: 'change succeed'
            }
        }
    }

    async validateToken(authDto: AuthDto): Promise<any> {
        const { id, loginMethod, accessToken } = authDto;
        const userInfo = await this.userRepository.findOne({ id, loginMethod });
        if (!userInfo) throw new NotFoundException('cannot find user');
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

    async refreshAccessToken({ id, loginMethod, refreshToken }: AuthDto): Promise<object> {
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
                const accessToken = this.jwtService.sign({ email: userInfo.email }, { expiresIn: '12h' });
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

    async getTokenKakao({ code }: KakaoLoginDto): Promise<object> {
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
                    nickname: userInfoKakao.data.properties.nickname,
                    password: null,
                    profileImage: userInfoKakao.data.properties.profile_image,
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
                            loginMethod: 1,
                            profileImage: userInfo.profileImage
                        }
                    },
                    message: 'login successfully'
                }
            }
        } catch {
            throw new UnauthorizedException('permission denied');
        }
    }

    async getMypage(page: number, user?: number, other?: number): Promise<object> {
        try {
            let limit: number = 9;
            let offset: number = (page - 1) * 9;
            const userInfo = await this.userRepository.getUserInfo(other || user);
            const followedOrNot = await this.followRepository.followedOrNot(user || undefined, other || user);
            const articles = await this.articleRepository.getArticleInfo(other || user, limit, offset);
            if (!articles.length) throw Error;
            // // 각 게시물에 태그 이름(배열) 추가
            let newArticles = [];
            for (const article of articles) {
                const tagIds: number[] = await this.articleToTagRepository.getTagIds(article.id);
                let tagNames: string[] = [];
                for (const tagId of tagIds) {
                    const tagName: string = await this.tagRepository.getTagNameWithIds(tagId);
                    tagNames.push(tagName);
                }
                article.tags = tagNames;

                interface articleObject {
                    id: string,
                    userId: number,
                    thumbnail: string,
                    nickname: string
                    totalLike: number,
                    totalComment: number,
                    profileImage: string,
                    tags: string[]
                }
                let creation: articleObject = {
                    id: article.id,
                    userId: other || user,
                    thumbnail: article.thumbnail,
                    nickname: userInfo.nickname,
                    totalLike: article.totalLike,
                    totalComment: article.totalComment,
                    profileImage: userInfo.profileImage,
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
                        totalFollowing: userInfo.totalFollowing,
                        followedOrNot: followedOrNot
                    },
                    articles: newArticles
                },
                message: "ok"
            }
        } catch {
            throw new NotFoundException("No Content")
        }
    }
}
