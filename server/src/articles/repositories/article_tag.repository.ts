import { EntityRepository, Repository } from "typeorm";
import { ArticleToTag } from "../entities/article_tag.entity";

@EntityRepository(ArticleToTag)
export class ArticleToTagRepository extends Repository<ArticleToTag>{
  async connectArticleTag(articleId: number, tagId: number, order: number, tagName: string) {
    const result = await this.save({articleId, tagId, order, tagName});
    return result;
  }

  async deleteTags(articleId: number) {
    const result = await this.delete({articleId});
  }
  
  async countTag(articleId: number) {
    const count = await this.count({articleId});
    return count;
  }

  async getTagIds(articleId: number): Promise<object> {
    const tagIds = await this.find({where: {articleId}, select: ["tagId"]});
    const result = tagIds.map((tag) => tag.tagId);
    return result
  }

  async getArticleIds(tagId: number) {
    const result = await this.createQueryBuilder("tag")
    .where({tagId})
    .getMany();
    const articleIds = result.map((each) => each.articleId);
    return articleIds
  }
}