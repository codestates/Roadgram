import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, Response, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { HttpService } from '@nestjs/axios';
import { UpdateUserDto } from './dto/updateUser.dto';
import axios from 'axios';
require('dotenv').config();

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private httpService: HttpService,
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
        return { message: 'logout succeed' }
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

    async validateToken(accessToken: string, id: number, loginMethod: number) {
        const userInfo = await this.userRepository.findOne({ id: id, login_method: loginMethod });
        if (!userInfo) throw new BadRequestException('bad request');
        if (loginMethod === 0) {
            try {
                await this.jwtService.verifyAsync(accessToken);
                return true;
            } catch {
                throw new UnauthorizedException('request new access token');
            }
        }
    }

    async getRefreshToken(id: number, loginMethod: number, refreshToken: string) {
        const userInfo = await this.userRepository.findOne({ id, login_method: loginMethod });
        if (!userInfo) throw new BadRequestException('bad request');
        if (loginMethod === 0) {
            if (refreshToken === userInfo.refresh_token) {
                const accessToken = this.jwtService.sign({ email: userInfo.email }, { expiresIn: '1h' });
                return {
                    data: { accessToken },
                    message: 'new access token'
                }
            }
            else {
                this.userRepository.deleteRefreshToken(id);
                throw new UnauthorizedException('invaild token');
            }
        }
    }

    async getTokenKakao(code: string) {
        const tokenRequest = await axios.post(`https://kauth.kakao.com/oauth/token`,
            {
                grant_type: "authorization_code",
                client_id: process.env.CLIENT_ID,
                redirect_uri: "http://localhost:3000",
                code: code
            },
            {
                headers: { 'Content-Type': "application/x-www-form-urlencoded" },
            }
        );
        const userInfoKakao = await axios.post('kapi.kakao.com',
            {
                property_keys: `["kakao_account.email"]`
            },
            {
                headers: {
                    'Authorization': `Bearer ${tokenRequest.data.access_token}`,
                    'Content-Type': "application/x-www-form-urlencoded"
                }
            }
        )
        const userInfo=await this.userRepository.findOne({email:userInfoKakao.data.kakao_account.email});
        if(!userInfo){
            const user={
                email:userInfoKakao.data.email,
                nickname:null,
                password:null,
                login_method:1,
                refresh_token:tokenRequest.data.refresh_token
            }
            const createdUserInfo=this.userRepository.create(user);
            return {
                data:{
                    accessToken:tokenRequest.data.access_token,
                    refreshToken:tokenRequest.data.refresh_token,
                    userInfo:{
                        userId:createdUserInfo.id,
                        nickname:createdUserInfo.nickname,
                        loginMethod:1
                    }
                },
                message:'signup successfully'
            }
        }
        else{
            return {
                data:{
                    accessToken:tokenRequest.data.access_token,
                    refreshToken:tokenRequest.data.refresh_token,
                    userInfo:{
                        userId:userInfo.id,
                        nickname:userInfo.nickname,
                        loginMethod:1
                    }
                },
                message:'login successfully'
            }
        }
    }
}
