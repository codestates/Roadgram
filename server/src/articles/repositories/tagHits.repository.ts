import { EntityRepository, Repository } from "typeorm";
import { TagHits } from "../entities/tagHits.entity";

@EntityRepository(TagHits)
export class TagHitsRepository extends Repository<TagHits>{
  async createTagHits(id: number, tagName: string): Promise<TagHits> {
    const result = await this.save({tagId: id, tagName})
    console.log("createTagHits", result)
    return result
  }

  async addTagHits(id: number): Promise<boolean> {
    console.log("id", id)
    const beforeHits = await this.findOne(id, {select: ['hits']});
    await this.increment({id}, 'hits', 1)
    const afterHits = await this.findOne(id, {select: ['hits']});
    return beforeHits.hits + 1 === afterHits.hits
  }

  async getPopularTag(limit: number, condition: string): Promise<TagHits[]> {
    const result = await this.createQueryBuilder('tagHits')
    .select(['tag_id', 'tag_name', 'hits'])
    .where('Date(created_at) = :condition', { condition })
    .orderBy('hits', 'DESC')
    .take(limit)
    .getRawMany()
    return result
  }
}