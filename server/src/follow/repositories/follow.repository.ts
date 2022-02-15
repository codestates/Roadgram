import { EntityRepository, Repository } from "typeorm";
import { Follow } from "../entities/follow.entity";

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow>{
  async getFollowing(id: number): Promise<Follow[]>{
    const following = await this.find({select: ["following"], where: {follower_id: id}})
    return following;
  }
}