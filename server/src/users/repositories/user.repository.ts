import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "../dto/createUser.dto";
import { User } from "../entities/user.entity";
import { NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "../dto/updateUser.dto";
import { FollowDto } from 'src/follow/dto/follow.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async getUserInfo(userId: number): Promise<User | any> {
        const userInfo = await this.find({ id: userId });
        return userInfo[0];
    }

    async createUser({ email, password, nickname }: CreateUserDto) {
        const user = this.create({ email, password, nickname, loginMethod: 0 });
        await this.save(user);
        return { message: "signup succeed" };
    }

    deleteUser(id: number) {
        this.delete({ id });
    }

    async updateUser(userData: UpdateUserDto): Promise<object> {
        const user: User = await this.findOne({ id: userData.user, loginMethod: userData.loginMethod });
        if (!user) {
            throw new NotFoundException('cannot find user by id');
        };
        if (userData.password) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(userData.password, salt);
        }
        if (userData.nickname) user.nickname = userData.nickname;
        if (userData.profileImage) user.profileImage = userData.profileImage;
        user.statusMessage = userData.statusMessage;
        this.save(user);
        return {
            data: {
                userInfo: {
                    statusMessage: user.statusMessage,
                    profileImage: user.profileImage,
                    nickname: user.nickname
                }
            },
            message: 'change succeed'
        };
    };

    getCommentWriterInfo(userId: number): Promise<object> {
        return this.findOne({ where: { id: userId }, select: ["id", "nickname", "profileImage"] });
    };

    async putRefreshToken(id: number, refreshToken: string) {
        this.update({ id }, { refreshToken });
    };

    async deleteRefreshToken(id: number) {
        this.update({ id }, { refreshToken: null });
    };

    async followIncrement(followDto: FollowDto): Promise<object> {
        const { user, followingUserId } = followDto;
        await this.increment({ id: followingUserId }, "totalFollower", 1);
        await this.increment({ id: user }, "totalFollowing", 1);
        return await this.findOne({ where: { id: followingUserId }, select: ["id", "totalFollower"] });
    };

    async followDecrement(followDto: FollowDto): Promise<object> {
        const { user, followingUserId } = followDto;
        await this.decrement({ id: followingUserId }, "totalFollower", 1);
        await this.decrement({ id: user }, "totalFollowing", 1);
        return await this.findOne({ where: { id: followingUserId }, select: ["id", "totalFollower"] });
    };

    async getProfileList(userIds: number[], limit: number, offset: number): Promise<object[]> {
        const profileList = await this.findByIds(userIds, { select: ["id", "nickname", "profileImage"], order: { nickname: "ASC" }, take: limit, skip: offset });
        return profileList;
    };

    async getUsername(id: number): Promise<object | any> {
        const result = await this.find({ where: { id }, select: ["nickname"] });
        return result[0].nickname
    };

    async getProfileImage(id: number): Promise<object | any> {
        const result = await this.find({ where: { id }, select: ["profileImage"] });
        return result[0].profileImage
    };
}