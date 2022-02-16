import { EntityRepository, Repository } from "typeorm";
import { ArticleToTag } from "../entities/article_tag.entity";

@EntityRepository(ArticleToTag)
export class ArticleToTagRepository extends Repository<ArticleToTag>{
  async connectArticleTag(articleId, tagId, order, tagName) {
    const result = await this.save({article_id: articleId, tag_id: tagId, order, tag_name: tagName});
    return result;
  }

  async deleteTags(articleId) {
    const result = await this.delete({article_id: articleId});
  }
  
  async countTag(articleId) {
    const count = await this.count({article_id: articleId});
    return count;
  }
}