import { EntityRepository, Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment>{

}