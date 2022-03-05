import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateTrack implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into("Track")
            .values([])
            .execute()
    }
}