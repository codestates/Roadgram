import { NotFoundException } from "@nestjs/common";
import { Follow } from "src/follow/entities/follow.entity";
import { EntityRepository, Repository } from "typeorm";
import { UpdateArticleDto } from "../dto/updateArticle.dto";
import { Article } from "../entities/article.entity";


@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {

  async getMain(following: number[], page: number, pageSize: number): Promise<object>{
    let limit: number = pageSize;
    let offset: number = (page - 1) * pageSize;
    // const followingId = following.map((each) => each.following_id);

    const articles = await this.createQueryBuilder("article")
    .where("article.user_id IN (:...user_id)", { user_id: following})
    .leftJoinAndSelect("article.tags", "tags")
    .orderBy("article.created_at")
    .take(limit)
    .skip(offset)
    .getMany();
    
    return articles;
  }

  async getRecent(page, pageSize): Promise<object> {
    let limit: number = pageSize;
    let offset: number = (page - 1) * pageSize;

    const articles = await this.createQueryBuilder("article")
    .leftJoinAndSelect("article.tags", "tags")
    .orderBy("article.created_at")
    .take(limit) // limit 
    .skip(offset) // offset
    .getMany();

    return articles;
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
    const articleInfo = await this.find({where: {id: articleId},  relations: ["road", "tags", "comments"]});
    return articleInfo[0];
  }

  async updateContent(updateArticleDto: UpdateArticleDto) {
    const {articleId, user, content} = updateArticleDto;
    const result = await this.update(articleId, {content})
    if(result.affected === 0) {
      throw new NotFoundException("Not Found Article you wanted to delete")
    }
    return true 
  }
  
  async isOwner(user, id) {
    const isOwner = await this.find({where: {user_id: user, id}});
    if(!isOwner || isOwner.length === 0) {
      throw new NotFoundException("Not Found Article you wanted to use")
    }
    return true
  }

  async deleteArticle(id: number, user: number): Promise<object> {
      const result = await this.delete(id);
      if(result.affected === 0) {
        throw new NotFoundException("Not Found Article you wanted to delete")
      } else {
        return {
          message: 'article deleted'
        }
      }
  }

  async likeIncrement(articleId: number): Promise<number> {
    await this.increment({id: articleId}, "totalLike", 1);
    const articleInfo = await this.findOne(articleId, {select: ["totalLike"]});
    return articleInfo.totalLike;
  }

  async likeDecrement(articleId: number): Promise<number> {
    await this.decrement({id: articleId}, "totalLike", 1);
    const articleInfo = await this.findOne(articleId, {select: ["totalLike"]});
    return articleInfo.totalLike;
  }
  
  async commentIncrement(articleId: number): Promise<number> {
    await this.increment({id: articleId}, "totalComment", 1);
    const articleInfo = await this.findOne(articleId, {select: ["totalComment"]});
    return articleInfo.totalComment;
  }

  async commentDecrement(articleId: number): Promise<number> {
    await this.decrement({id: articleId}, "totalComment", 1);
    const articleInfo = await this.findOne(articleId, {select: ["totalComment"]});
    return articleInfo.totalComment;
  }

  async getMypageArticle(id: number): Promise<object|[]>{
    const mypageArticle = await this.find({where: {user_id: id},  relations: ["tags"]});
    return mypageArticle;
  }

  async searchArticle(tag: string): Promise<Article|any> {
    const articles = await this.createQueryBuilder("article")
    .leftJoinAndSelect("article.tags", "tags")
    .leftJoinAndSelect("tags.tag", "tag")
    .where("article.id IN (Select article_id from article_tag left join tag on article_tag.tag_id = tag.id where tag_name = :tag)", {tag})
    .orderBy("article.created_at")
    .printSql()
    .getMany();
    console.log("articles", articles);
    return articles;
  }
}
