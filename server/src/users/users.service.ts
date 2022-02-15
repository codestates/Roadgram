import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { UpdateUserDto } from './dto/updateUser.dto';
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
            const accessToken = this.jwtService.sign({ email: userInfo.email }, { expiresIn: '30s' });
            const refreshToken = this.jwtService.sign({ email: userInfo.email }, { expiresIn: '2h' });
            return {
                data: {
                    data: {
                        accessToken: accessToken,
                        userInfo: {
                            userId: userInfo.id,
                            nickName: userInfo.nickname
                        }
                    },
                    message: 'login ok'
                },
                refreshToken: refreshToken
            }
        }
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

    // async getTokenKakao(code: string) {
    // try {
    //         return await axios({
    //             method:"POST",
    //             url:"https://kauth.kakao.com/oauth/token",
    //             data:{
    //                 grant_type:"authorization_code",
    //                 client_id:process.env.CLIENT_ID,
    //                 redirect_uri:"http://localhost:3000/users/kakao/callback",
    //                 code:code
    //             },
    //             headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    //             withCredentials:true
    //         })
    // .post("https://kauth.kakao.com/oauth/token",{
    //     grant_type:"authorization_code",
    //     client_id:process.env.CLIENT_ID,
    //     redirect_uri:"http://localhost:3000/users/kakao/callback",
    //     code:code
    // },{
    //     headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    //     withCredentials:true
    // }
    // } catch {
    //     throw new UnauthorizedException('not authorized')
    // }
    // }

    // async kakaoCallback(user){
    //     return user;
    // }
}
