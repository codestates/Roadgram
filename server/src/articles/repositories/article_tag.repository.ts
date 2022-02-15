import { EntityRepository, Repository } from "typeorm";
import { ArticleToTag } from "../entities/article_tag.entity";

@EntityRepository(ArticleToTag)
export class ArticleToTagRepository extends Repository<ArticleToTag>{
  async connectArticleTag(articleId, tagId, order) {
    const result = this.save({article_id: articleId, tag_id: tagId, order});
    return result;
  }

  async deleteTags(id) {
    const result = await this.delete({article_id: id});
  }
}