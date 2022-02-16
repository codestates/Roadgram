import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { UpdateArticleDto } from "../dto/updateArticle.dto";
import { Article } from "../entities/article.entity";

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {


  async getMain(following): Promise<object>{
    const followingId = following.map((each) => each.following_id);
    const articles = await this.createQueryBuilder("article")
    .where("article.user_id IN (:...user_id)", { user_id: followingId })
    .leftJoinAndSelect("article.tags", "tags")
    .orderBy("article.created_at")
    .getMany();
    
    return articles;
    // for(const el of following) {
    //   const userId = el.following_id;
    //   const result = await this.find({where: {user_id: userId}, relations: ["articleToTags"]});  
    //   console.log("article:::::", result);
    //   if(result.length !== 0) {
    //     article.push(result[0]);
    //   }
    // }

    // console.log("return 전 내용::::", article);
    // return article;
  }

  async getArticleDetail(id): Promise<Article[]>{
    const result = await this.find({where :{id: id}, relations:["road", "tags", "comments"]})
    console.log("result", result);
    return result
  }
  
  async createArticle(userId: number, content: string, thumbnail: string) {
    const result = await this.save({user_id: userId, content, thumbnail});
    return result
  }

  async getArticleInfo(articleId: number) {
    const articleInfo = await this.find({where: {id: articleId},  relations: ["tracks", "comments"]});
    return articleInfo[0];
  }

  async updateContent(updateArticleDto: UpdateArticleDto) {
    const {articleId, content} = updateArticleDto;
    const result = await this.update(articleId, {content})
    return result;
  } 

  async deleteArticle(id: number) {
    const result = await this.delete(id);
    
    if(result.affected === 0) {
      throw new NotFoundException("Not Found Article you wanted to delete")
    } else {
      return {
        message: 'article deleted'
      }
    }
  }

  async likeIncrement(articleId: number) {
    await this.increment({id: articleId}, "total_like", 1);
    return await this.findOne({where: {id: articleId}, select: ["total_like"]});
  }

  async likeDecrement(articleId: number) {
    await this.decrement({id: articleId}, "total_like", 1);
    return await this.findOne({where: {id: articleId}, select: ["total_like"]});
  }
  
  commentIncrement(articleId: number) {
    this.increment({id: articleId}, "total_comment", 1);
    return this.findOne({where: {id: articleId}, select: ["id", "total_comment"]});
  }

  commentDecrement(articleId: number) {
    this.decrement({id: articleId}, "total_comment", 1);
    return this.findOne({where: {id: articleId}, select: ["id", "total_comment"]});
  }
}