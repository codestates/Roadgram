import { EntityRepository, Repository } from "typeorm";
import { Article } from "../entities/article.entity";

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article>{

}