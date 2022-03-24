import { EntityRepository, Repository } from "typeorm";
import { ArticleToTag } from "../entities/article_tag.entity";

@EntityRepository(ArticleToTag)
export class ArticleToTagRepository extends Repository<ArticleToTag>{
  async connectArticleTag(articleId: number, tagId: number, order: number) {
    const result = await this.save({ articleId, tagId, order });
    return result;
  }

  async deleteTags(articleId: number) {
    await this.delete({ articleId });
  }

  async countTag(articleId: number) {
    const count = await this.count({ articleId });
    return count;
  }

  async getTagIds(articleId: number): Promise<number[]> {
    const tagIds = await this.find({ where: { articleId }, select: ["tagId"], order: { order: "ASC" } });
    const result = tagIds.map((tag) => tag.tagId);
    return result;
  }

  async getArticleIds(tagId: number) {
    const result = await this.createQueryBuilder("tag")
      .where({ tagId })
      .getMany();

    if (!result || result.length === 0) {
      return undefined;
    } else {
      const articleIds = result.map((each) => each.articleId);
      return articleIds;
    }
  }
}