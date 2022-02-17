import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "../dto/createUser.dto";
import { User } from "../entities/user.entity";
import * as bcrypt from 'bcrypt'
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "../dto/updateUser.dto";
import { FollowDto } from 'src/follow/dto/follow.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async getUserInfo(userId: number) {
        const userInfo = await this.find({ id: userId });
        return userInfo[0];
    }

    async createUser(createUserDto: CreateUserDto) {
        const { email, password, nickname } = createUserDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({ email, password: hashedPassword, nickname, login_method: 0 });

        try {
            await this.save(user);
            return { message: "signup succeed" }
        } catch {
            throw new InternalServerErrorException();
        }
    }
    async deleteUser(id: number) {
        try {
            await this.delete({ id })
            return { message: 'withdrawal succeed' }
        } catch {
            throw new NotFoundException('not found')
        }
    }

    async updateUser(userData: UpdateUserDto) {
        const user: User = await this.findOne({ id: userData.user, login_method: userData.loginMethod });

        if (!user) {
            throw new BadRequestException('bad request');
        }

        if (userData.password) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            user.password = hashedPassword;
        }

        if (userData.nickname) user.nickname = userData.nickname;

        if (userData.profileImage) user.profile_image = userData.profileImage;

        if (userData.statusMessage) user.status_message = userData.statusMessage;

        this.save(user);
        return {
            data: {
                userInfo: {
                    statusMessage: user.status_message,
                    profileImage: user.profile_image
                }
            },
            message: 'change succeed'
        }
    }

    getCommentWriterInfo(userId: number): Promise<object> {
        return this.findOne({where: {id: userId}, select: ["id", "nickname", "profile_image"]});
    }
    
    async putRefreshToken(id: number, refreshToken: string) {
        const user = await this.findOne({ id:id });
        user.refresh_token = refreshToken;
        this.save(user);
    }

    async deleteRefreshToken(id: number) {
        const user = await this.findOne({ id:id });
        user.refresh_token = null;
        this.save(user);
    }

    async followIncrement(followDto: FollowDto): Promise<object> {
        const { user, followingUserId } = followDto;
        await this.increment({id: followingUserId}, "total_follower", 1);
        await this.increment({id: user}, "total_following", 1);
        return await this.findOne({where: {id: followingUserId}, select: ["id", "total_follower"]});
    }

    async followDecrement(followDto: FollowDto): Promise<object> {
        const { user, followingUserId } = followDto;
        await this.decrement({id: followingUserId}, "total_follower", 1);
        await this.decrement({id: user}, "total_following", 1);
        return await this.findOne({where: {id: followingUserId}, select: ["id", "total_follower"]});
    }

    async getProfileList(userIds: number[]): Promise<object[]> {
        const profileList = [];
        for (const id of userIds) {
            const user = await this.findOne(id, { select: ["id", "nickname", "profile_image"] });
            profileList.push(user);
        }
        return profileList;
    }
}