import { EntityRepository, Repository } from "typeorm";
import { Tag } from "../entities/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag>{
  async findTagName(tagName) {
    const reuslt = await this.find({tagName})
    return reuslt;
  }

  async createTag(tagName) {
    const result = await this.save({tagName});
    return result;
  }
}