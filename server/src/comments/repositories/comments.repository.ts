import { EntityRepository, Repository } from 'typeorm';
import { Comments } from '../entities/comments.entity';
import { CreateCommentDto, ModifyCommentDto } from '../dto/comments.dto';

@EntityRepository(Comments)
export class CommentRepository extends Repository<Comments> {
  async createComment(createCommentDto: CreateCommentDto): Promise<object> {
    const { user, articleId, comment } = createCommentDto;

    const newComment = this.create({
      userId: user,
      articleId: articleId,
      comment,
    });
    await this.save(newComment);

    const commentInfo = await this.findOne(newComment.id, { select: ["id", "comment", "createdAt", "updatedAt"] });

    return commentInfo;
  }

  async getComments(articleId: number, limit: number, offset: number): Promise<Comments[] | undefined> {
    const result = await this.find({ where: { articleId }, order: { createdAt: "ASC" }, take: limit, skip: offset });
    return result;
  }

  async getCommentsByUserId(id:number){
    const comments=await this.find({userId:id});
    return comments.map((comment)=>comment.articleId);
  }
}
