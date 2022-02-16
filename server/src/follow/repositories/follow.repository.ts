import { EntityRepository, Repository } from "typeorm";
import { FollowDto } from '../dto/follow.dto';
import { Follow } from "../entities/follow.entity";

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow> {
  async followedOrNot(followDto: FollowDto) {
    const { user, followingUserId } = followDto;
    return await this.findOne({
      follower_id: user,
      following_id: followingUserId
    });
  }

  async follow(followDto: FollowDto): Promise<string> {
    const { user, followingUserId } = followDto;
    const newFollow = this.create({
      follower_id: user,
      following_id: followingUserId
    });
    await this.save(newFollow);
    return 'follow success';
  };

  async unfollow(followDto: FollowDto): Promise<string> {
    const { user, followingUserId } = followDto;
    this.delete({
      follower_id: user,
      following_id: followingUserId
    });
    return 'unfollow success';
    }

  async getFollowingUser(id: number): Promise<Follow[]> {
    const following = await this.find({ select: [ "following" ], where: { follower_id: id }});
    return following;
  }
}