import { EntityRepository, Repository } from "typeorm";
import { Track } from "../entities/track.entity";

@EntityRepository(Track)
export class TrackRepository extends Repository<Track>{
  async createTrack(road: any[], articleId: number) {
    return await Promise.all(road.map(async (each) => {
      const { order, imageSrc, placeName, addressName, x, y } = each;
      const track = await this.save({ order, imageSrc, placeName, addressName, x, y, articleId });
      return {
        order: track.order,
        imageSrc: track.imageSrc,
        placeName: track.placeName,
        addressName: track.addressName,
        x: track.x,
        y: track.y,
      }
    }))
  }

  async getRoads(articleId: number): Promise<any> {
    const result = await this.find({ where: { articleId }, order: { order: "ASC" } });
    const data = result.map((each) => {
      return {
        imageSrc: each.imageSrc,
        placeName: each.placeName,
        addressName: each.addressName,
        x: each.x,
        y: each.y,
      }
    })
    return data;
  }
}