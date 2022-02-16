import { EntityRepository, Repository } from "typeorm";
import { ArticleToTag } from "../entities/article_tag.entity";

@EntityRepository(ArticleToTag)
export class ArticleToTagRepository extends Repository<ArticleToTag>{
  async connectArticleTag(articleId, tagId, order, tagName) {
    const result = await this.save({articleId, tagId, order, tagName});
    return result;
  }

  async deleteTags(articleId) {
    const result = await this.delete({articleId});
  }
  
  async countTag(articleId) {
    const count = await this.count({articleId});
    return count;
  }
}