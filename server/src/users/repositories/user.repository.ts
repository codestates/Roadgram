import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "../dto/createUser.dto";
import { User } from "../entities/user.entity";
import * as bcrypt from 'bcrypt'
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "../dto/updateUser.dto";
import { FollowDto } from 'src/follow/dto/follow.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async getUserInfo(userId: number): Promise<User | any> {
        const userInfo = await this.find({ id: userId });
        return userInfo[0];
    }

    async createUser(createUserDto: CreateUserDto) {
        const { email, password, nickname } = createUserDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({ email, password: hashedPassword, nickname, loginMethod: 0 });
        await this.save(user);
        return { message: "signup succeed" }
    }

    async deleteUser(id: number) {
        try {
            await this.delete({ id })
            return { message: 'withdrawal succeed' };
        } catch {
            throw new NotFoundException('not found');
        }
    }

    async updateUser(userData: UpdateUserDto) {
        const user: User = await this.findOne({ id: userData.user, loginMethod: userData.loginMethod });

        if (!user) {
            throw new BadRequestException('bad request');
        }

        if (userData.password) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            user.password = hashedPassword;
        }

        if (userData.nickname) user.nickname = userData.nickname;

        if (userData.profileImage) user.profileImage = userData.profileImage;

        if (userData.statusMessage) user.statusMessage = userData.statusMessage;

        this.save(user);
        return {
            data: {
                userInfo: {
                    statusMessage: user.statusMessage,
                    profileImage: user.profileImage
                }
            },
            message: 'change succeed'
        }
    }

    getCommentWriterInfo(userId: number): Promise<object> {
        return this.findOne({ where: { id: userId }, select: ["id", "nickname", "profileImage"] });
    }

    async putRefreshToken(id: number, refreshToken: string) {
        this.update({id},{refreshToken})
    }

    async deleteRefreshToken(id: number) {
        this.update({id},{refreshToken:null})
    }

    async followIncrement(followDto: FollowDto): Promise<object> {
        const { user, followingUserId } = followDto;
        await this.increment({id: followingUserId}, "totalFollower", 1);
        await this.increment({id: user}, "totalFollowing", 1);
        return await this.findOne({where: {id: followingUserId}, select: ["id", "totalFollower"]});
    }

    async followDecrement(followDto: FollowDto): Promise<object> {
        const { user, followingUserId } = followDto;
        await this.decrement({id: followingUserId}, "totalFollower", 1);
        await this.decrement({id: user}, "totalFollowing", 1);
        return await this.findOne({where: {id: followingUserId}, select: ["id", "totalFollower"]});
    }

    async getProfileList(userIds: number[]): Promise<object[]> {
        const profileList = [];
        for (const id of userIds) {
            const user = await this.findOne(id, { select: ["id", "nickname", "profileImage"] });
            profileList.push(user);
        }
        return profileList;
    }

    async getUsername(id: number): Promise<object|any> {
        const result =  await this.find({where: {id}, select: ["nickname"]})
        return result[0].nickname
    }
}