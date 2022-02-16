import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fips } from 'crypto';
import { UserRepository } from 'src/users/repositories/user.repository';
import { FollowDto } from './dto/follow.dto';
import { Follow } from './entities/follow.entity';
import { FollowRepository } from './repositories/follow.repository';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowRepository)
    private followRepository: FollowRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

//   async followUnfollow(followDto: FollowDto): Promise<object> {
//     const { user, followingUserId } = followDto;
//     const followedOrNot = await this.followRepository.followedOrNot(followDto);

//     if (followedOrNot === undefined) {
//       const result = await this.followRepository.follow(followDto);
//       const followedUserInfo = await this.userRepository.followerIncrement(followingUserId);
//       await this.userRepository.followingIncrement(user);
//       return {
//         data: followedUserInfo,
//         message: result
//       }
//     } else {
//       const result = await this.followRepository.unfollow(followDto);
//       const followedUserInfo = await this.userRepository.followerDecrement(followingUserId);
//       await this.userRepository.followingDecrement(user);
//       return {
//         data: followedUserInfo,
//         message: result
//       }
//     }
//   }
}
