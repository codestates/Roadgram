import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUserInfo(userId: number) {
    const userInfo = await this.find({id: userId});
    return userInfo[0];
  }
}