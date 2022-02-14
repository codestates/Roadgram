import { EntityRepository, Repository } from "typeorm";
import { ArticleToTag } from "../entities/article_tag.entity";

@EntityRepository(ArticleToTag)
export class ArticleToTagRepository extends Repository<ArticleToTag>{

}