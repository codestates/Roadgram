import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repositories/user.repository';
import { FollowDto } from './dto/follow.dto';
import { FollowRepository } from './repositories/follow.repository';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowRepository)
    private followRepository: FollowRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async followUnfollow(followDto: FollowDto): Promise<object> {
    const followedOrNot = await this.followRepository.followedOrNot(followDto);

    if (followedOrNot === undefined) {
      const result = await this.followRepository.follow(followDto);
      const followResult = await this.userRepository.followIncrement(followDto);
      return {
        data: followResult,
        message: result
      };
    } else {
      const result = await this.followRepository.unfollow(followDto);
      const unfollowResult = await this.userRepository.followDecrement(followDto);
      return {
        data: unfollowResult,
        message: result
      };
    };
  };

  async getFollowerList(user: number, page: number): Promise<object> {
    const followerIds = await this.followRepository.getFollowedIds(user);
    if (!followerIds) {
      throw new UnauthorizedException('permisson denied');
    } else if (followerIds.length === 0) {
      throw new NotFoundException("No followers yet");
    } else {
      let limit: number = 10;
      let offset: number = (page - 1) * 10;
      const followers = await this.userRepository.getProfileList(followerIds, limit, offset);
      return {
        data: followers,
        message: "follower list"
      };
    };
  };

  async getFollowingList(user: number, page: number): Promise<object> {
    const followingIds = await this.followRepository.getFollowingIds(user);
    if (!followingIds) {
      throw new UnauthorizedException('permisson denied');
    } else if (followingIds.length === 0) {
      throw new NotFoundException('No followings yet');
    } else {
      let limit: number = 10;
      let offset: number = (page - 1) * 10;
      const followings = await this.userRepository.getProfileList(followingIds, limit, offset);
      return {
        data: followings,
        message: "following list"
      };
    };
  };
};
