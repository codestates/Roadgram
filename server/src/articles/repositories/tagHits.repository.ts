import { EntityRepository, Repository } from "typeorm";
import { TagHits } from "../entities/tagHits.entity";

@EntityRepository(TagHits)
export class TagHitsRepository extends Repository<TagHits>{
  async createTagHits(id: number, tagName: string): Promise<TagHits> {
    const result = await this.save({tagId: id, tagName})
    return result
  }

  async addTagHits(id: number): Promise<boolean> {
    const beforeHits = await this.findOne(id, {select: ['hits']});
    await this.increment({id}, 'hits', 1)
    const afterHits = await this.findOne(id, {select: ['hits']});
    return beforeHits.hits + 1 === afterHits.hits
  }

  async findId(id: number, condition: string): Promise<number | undefined>{
    try {
      const result = await this.createQueryBuilder('tagHits')
      .select('id')
      .where('tag_id = :id', {id})
      .andWhere('Date(created_at) = :condition', { condition })
      .getRawOne()
      return result.id
    } catch(err) {
      console.log(err)
      return undefined
    }    
  }

  async getPopularTag(limit: number, condition: string): Promise<TagHits[]> {
    const result = await this.createQueryBuilder('tagHits')
    .select(['tag_id as tagId', 'tag_name as tagName', 'hits'])
    .where('Date(created_at) = :condition', { condition })
    .orderBy('hits', 'DESC')
    .take(limit)
    .getRawMany()
    return result
  }
}