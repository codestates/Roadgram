import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { UpdateArticleDto } from "../dto/updateArticle.dto";
import { Article } from "../entities/article.entity";


@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {

  async getUserId(articleId: number): Promise<number> {
    const result = await this.find({ where: { id: articleId }, select: ["userId"] });
    return result[0].userId;
  }

  async getArticleInfo(ids: number[] | any | void, limit: number, offset: number): Promise<any> {
    if (ids.length === 0) {
      const articles = await this.createQueryBuilder("article")
        .orderBy("created_at",'DESC')
        .take(limit)
        .skip(offset)
        .getMany();
      return articles;
    } else if (typeof ids === 'number') {
      const article = await this.createQueryBuilder("article")
        .where("user_id = :ids", { ids })
        .orderBy("created_at",'DESC')
        .take(limit)
        .skip(offset)
        .getMany();
      return article;
    } else {
      const articles = await this.createQueryBuilder("article")
        .where("user_id IN (:...ids)", { ids })
        .orderBy("created_at",'DESC')
        .take(limit)
        .skip(offset)
        .getMany();
      return articles;
    }
  }

  async getArticleDetail(id: number): Promise<Article> {
    const result = await this.find({ id });
    return result[0];
  }

  async createArticle(userId: number, content: string, thumbnail: string) {
    const result = await this.save({ userId, content, thumbnail });
    return result;
  }

  async deleteArticle(id: number): Promise<object> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Not Found Article you wanted to delete");
    } else {
      return {
        message: 'article deleted'
      }
    }
  }

  async likeIncrement(articleId: number): Promise<number> {
    await this.increment({ id: articleId }, "totalLike", 1);
    const articleInfo = await this.findOne(articleId, { select: ["totalLike"] });
    return articleInfo.totalLike;
  }

  async likeDecrement(articleId: number): Promise<number> {
    await this.decrement({ id: articleId }, "totalLike", 1);
    const articleInfo = await this.findOne(articleId, { select: ["totalLike"] });
    return articleInfo.totalLike;
  }

  async commentIncrement(articleId: number): Promise<number> {
    await this.increment({ id: articleId }, "totalComment", 1);
    const articleInfo = await this.findOne(articleId, { select: ["totalComment"] });
    return articleInfo.totalComment;
  }

  async commentDecrement(articleId: number): Promise<number> {
    await this.decrement({ id: articleId }, "totalComment", 1);
    const articleInfo = await this.findOne(articleId, { select: ["totalComment"] });
    return articleInfo.totalComment;
  }

  async searchArticle(articleIds: number[], limit: number, offset: number): Promise<Article | any> {
    const result = await this.findByIds(articleIds, { order: { createdAt: "DESC" }, take: limit, skip: offset });
    return result;
  }
}