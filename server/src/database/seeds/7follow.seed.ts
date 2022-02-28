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
                { followingId: 3, followerId: 7 },
                { followingId: 3, followerId: 8 },
                { followingId: 3, followerId: 9 },
                { followingId: 3, followerId: 10 },
                { followingId: 3, followerId: 11 },
                { followingId: 3, followerId: 12 },
                { followingId: 3, followerId: 13 },
                { followingId: 3, followerId: 14 },
                { followingId: 3, followerId: 15 },
                { followingId: 3, followerId: 16 },
                { followingId: 3, followerId: 17 },
                { followingId: 3, followerId: 18 },
                { followingId: 3, followerId: 19 },
                { followingId: 3, followerId: 20 },
                { followingId: 3, followerId: 21 },
                { followingId: 3, followerId: 22 },
                { followingId: 3, followerId: 23 },
                { followingId: 3, followerId: 24 },
                { followingId: 3, followerId: 25 },
                { followingId: 3, followerId: 26 },
                { followingId: 3, followerId: 27 },
                { followingId: 3, followerId: 28 },
                { followingId: 3, followerId: 29 },
                { followingId: 3, followerId: 30 },
                { followingId: 1, followerId: 3 },
                { followingId: 11, followerId: 3 },
                { followingId: 12, followerId: 3 },
                { followingId: 13, followerId: 3 },
                { followingId: 14, followerId: 3 },
                { followingId: 15, followerId: 3 },
                { followingId: 16, followerId: 3 },
                { followingId: 17, followerId: 3 },
                { followingId: 18, followerId: 3 },
                { followingId: 19, followerId: 3 },
                { followingId: 10, followerId: 3 },
                { followingId: 2, followerId: 3 },
                { followingId: 4, followerId: 3 },
                { followingId: 5, followerId: 3 },
                { followingId: 6, followerId: 3 },
                { followingId: 7, followerId: 3 },
                { followingId: 8, followerId: 3 },
                { followingId: 9, followerId: 3 },
                { followingId: 20, followerId: 3 },
            ])
            .execute()
    }
}