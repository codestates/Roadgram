import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateFollow implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into("Follow")
            .values([
                { followingId: 3, followerId: 1 },
                { followingId: 3, followerId: 2 },
                { followingId: 3, followerId: 4 },
                { followingId: 5, followerId: 6 },
            ])
            .execute()
    }
}