import { EntityRepository, Repository } from "typeorm";
import { Track } from "../entities/track.entity";

@EntityRepository(Track)
export class TrackRepository extends Repository<Track>{
  createTrack(road: [], articleId: number) {
    road.forEach(async (each) => {
      const {order, imageSrc, location} = each;
      // console.log("each:::", each);
      await this.save({order, image_src: imageSrc, location, article_id: articleId});
    })
  }
}