import { EntityRepository, Repository } from "typeorm";
import { Like } from "../entities/like.entity";

@EntityRepository(Like)
export class LikeRepository extends Repository<Like>{
    
}