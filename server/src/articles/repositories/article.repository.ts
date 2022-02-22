import { NotFoundException } from "@nestjs/common";
import { Follow } from "src/follow/entities/follow.entity";
import { EntityRepository, Repository } from "typeorm";
import { UpdateArticleDto } from "../dto/updateArticle.dto";
import { Article } from "../entities/article.entity";


@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {

  async getUserId(articleId: number): Promise<number> {
    const result = await this.find({ where: { id: articleId }, select: ["userId"] });
    return result[0].userId
  }

  async getArticleInfo(ids: number[] | any | void, limit: number, offset: number): Promise<any> {
    if (ids.length === 0) {
      const articles = await this.createQueryBuilder("article")
        .orderBy("created_at")
        .take(limit)
        .skip(offset)
        .getMany();
      return articles
    } else if (typeof ids === 'number') {
      const article = await this.createQueryBuilder("article")
        .where("user_id = :ids", { ids })
        .orderBy("created_at")
        .take(limit)
        .skip(offset)
        .getMany();
      return article;
    }
    else {
      const articles = await this.createQueryBuilder("article")
        .where("user_id IN (:...ids)", { ids })
        .orderBy("created_at")
        .take(limit)
        .skip(offset)
        .getMany();
      return articles
    }
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

  async getArticleDetail(id: number): Promise<Article> {
    const result = await this.find({ id });
    return result[0]
  }

  async createArticle(userId: number, content: string, thumbnail: string) {
    const result = await this.save({ userId, content, thumbnail });
    return result
  }

  async getArticleUsingUser(user: number) {
    const articleInfo = await this.find({ userId: user });
    return articleInfo[0];
  }

  async getArticleUsingId(articleId: number) {
    const articleInfo = await this.find({ where: { id: articleId } });
    return articleInfo[0];
  }

  async updateContent(updateArticleDto: UpdateArticleDto) {
    const { articleId, user, content } = updateArticleDto;
    const result = await this.update(articleId, { content })
    if (result.affected === 0) {
      throw new NotFoundException("Not Found Article you wanted to delete")
    }
    return true
  }

  async isOwner(user, id) {
    const isOwner = await this.find({ where: { userId: user, id } });
    if (!isOwner || isOwner.length === 0) {
      throw new NotFoundException("Not Found Article you wanted to use")
    }
    return true
  }

  async deleteArticle(id: number): Promise<object> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Not Found Article you wanted to delete")
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

  async getMypageArticle(id: number): Promise<object | []> {
    const mypageArticle = await this.find({ where: { userId: id }, relations: ["tags"] });
    return mypageArticle;
  }

  // async searchArticle(tag: string, limit: number, offset: number): Promise<Article|any> {
  //   const articles = await this.createQueryBuilder("article")
  //   .leftJoinAndSelect("article.tags", "tags")
  //   .leftJoinAndSelect("tags.tag", "tag")
  //   .where("article.id IN (Select article_id from article_tag left join tag on article_tag.tag_id = tag.id where tag_name = :tag)", {tag})
  //   .orderBy("article.created_at")
  //   .printSql()
  //   .getMany();
  //   console.log("articles", articles);
  //   return articles;
  // }

  async searchArticle(articleIds: number[], limit: number, offset: number): Promise<Article | any> {
    const result = await this.findByIds(articleIds, { order: { createdAt: "ASC" }, take: limit, skip: offset });
    return result
  }
}
