import { EntityRepository, Repository } from "typeorm";
import { FollowDto } from '../dto/follow.dto';
import { Follow } from "../entities/follow.entity";

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow> {
  async followedOrNot(user, followingUserId) {
    return await this.findOne({
      followerId: user,
      followingId: followingUserId
    });
  }

  async follow(followDto: FollowDto): Promise<string> {
    const { user, followingUserId } = followDto;
    const newFollow = this.create({
      followerId: user,
      followingId: followingUserId
    });
    await this.save(newFollow);
    return 'followed this user';
  };

  async unfollow(followDto: FollowDto): Promise<string> {
    const { user, followingUserId } = followDto;
    this.delete({
      followerId: user,
      followingId: followingUserId
    });
    return 'unfollowed this user';
  }

  async getFollowedIds(id: number): Promise<number[]> {
    const followed = await this.find({ select: [ "followerId" ], where: { followingId: id }});
    return followed.map((each) => each.followerId);
  }

  async getFollowingIds(id: number): Promise<number[]> {
    const following = await this.find({ select: [ "followingId" ], where: { followerId: id }});
    return following.map((each) => each.followingId);
  }
}