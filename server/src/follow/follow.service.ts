import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async followUnfollow(followDto: FollowDto): Promise<any> {
    const { user, followingUserId } = followDto;
    const followedOrNot = await this.followRepository.followedOrNot(user, followingUserId);

    if (followedOrNot === undefined) {
      throw new NotFoundException(`no user with ID ${followingUserId}`);
    } else if (!followedOrNot) {
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

  async getFollowerList(user: number, page: number): Promise<any> {
    const followerIds = await this.followRepository.getFollowedIds(user);

    if (page <= 0) {
      throw new NotAcceptableException('unavailable page query');
    } else if (!followerIds.length) {
      throw new NotFoundException('cannot find the user or followers');
    } else {
      let limit: number = 10;
      let offset: number = (page - 1) * 10;
      const followers = await this.userRepository.getProfileList(followerIds, limit, offset);
      
      if (followers.length > 10) throw new NotAcceptableException('list more than 10 users');
      else if (!followers.length) throw new NotFoundException('cannot find followers');
      return {
        data: followers,
        message: "follower list"
      };
    };
  };

  async getFollowingList(user: number, page: number): Promise<any> {
    const followingIds = await this.followRepository.getFollowingIds(user);

    if (page <= 0) {
      throw new NotAcceptableException('unavailable page query');
    } else if (!followingIds.length) {
      throw new NotFoundException('cannot find the user or followings');
    } else {
      let limit: number = 10;
      let offset: number = (page - 1) * 10;
      const followings = await this.userRepository.getProfileList(followingIds, limit, offset);
      
      if (followings.length > 10) throw new NotAcceptableException('list more than 10 users');
      else if(!followings.length) throw new NotFoundException('cannot find followings');
      return {
        data: followings,
        message: "following list"
      };
    };
  };
};
