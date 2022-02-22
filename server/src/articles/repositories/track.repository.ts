import { EntityRepository, Repository } from "typeorm";
import { Track } from "../entities/track.entity";

@EntityRepository(Track)
export class TrackRepository extends Repository<Track>{
  async createTrack(road: [], articleId: number) {
    return await Promise.all(road.map(async (each) => {
      const { order, imageSrc, location } = each;
      const track = await this.save({ order, imageSrc, location, articleId });
      return {
        imageSrc: track.imageSrc,
        location: track.location
      }
    }))
  }

  async getRoads(articleId: number): Promise<any> {
    const result = await this.find({ where: { articleId }, order: { order: "ASC" } });
    const data = result.map((each) => {
      return {
        imageSrc: each.imageSrc,
        location: each.location
      }
    })
    return data;
  }
}