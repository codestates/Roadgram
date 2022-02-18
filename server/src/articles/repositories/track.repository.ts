import { EntityRepository, Repository } from "typeorm";
import { Track } from "../entities/track.entity";

@EntityRepository(Track)
export class TrackRepository extends Repository<Track>{
  async createTrack(road: [], articleId: number) {
    road.forEach(async (each) => {
      const {order, imageSrc, location} = each;
      await this.save({order, imageSrc, location, articleId});
    })
  }

  async getRoads(articleId: number): Promise<any> {
    const result = await this.find({where: {articleId}, order: {order: "ASC"}});
    const data = result.map((each) => {
      return {
        imageSrc: each.imageSrc,
        location: each.location
      }
    })
    return data;
  }
}