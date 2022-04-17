import { EntityRepository, Repository } from "typeorm";
import { TagHits } from "../entities/tagHits.entity";

@EntityRepository(TagHits)
export class TagHitsRepository extends Repository<TagHits>{
  async createTagHits(id: number, tagName: string): Promise<number> {
    const createdItem = await this.create({tagId: id, tagName})
    const result = await this.save((createdItem));
    return result.id
  }

  async addTagHits(id: number) {
    const beforeHits = await this.findOne(id, {select: ['hits']});
    await this.increment({id}, 'hits', 1)
    const afterHits = await this.findOne(id, {select: ['hits']});
    return beforeHits.hits + 1 === afterHits.hits
  }
}