import { EntityRepository, Repository } from "typeorm";
import { Tag } from "../entities/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag>{
  async findTagName(tagname) {
    const reuslt = await this.find({tag_name: tagname})
    return reuslt;
  }

  async createTag(tagname) {
    const result = await this.save({tag_name: tagname});
    return result;
  }
}