import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateLike implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into("Likes")
            .values([
                { userId: 2, articleId: 1 },
                { userId: 3, articleId: 1 },
                { userId: 4, articleId: 1 },
                { userId: 3, articleId: 2 },
                { userId: 1, articleId: 2 },
                { userId: 5, articleId: 3 },
                { userId: 1, articleId: 5 },
                { userId: 2, articleId: 5 },
                { userId: 3, articleId: 5 },
                { userId: 5, articleId: 5 },
                { userId: 6, articleId: 5 },
                { userId: 4, articleId: 7 },
                { userId: 1, articleId: 8 },
                { userId: 3, articleId: 8 },
                { userId: 1, articleId: 9 },
                { userId: 2, articleId: 9 },
                { userId: 3, articleId: 9 },
                { userId: 4, articleId: 9 },
                { userId: 6, articleId: 9 },
                { userId: 1, articleId: 11 },
                { userId: 2, articleId: 11 },
                { userId: 4, articleId: 11 },
                { userId: 5, articleId: 11 },
                { userId: 1, articleId: 12 },
                { userId: 3, articleId: 12 },
                { userId: 4, articleId: 12 },
                { userId: 1, articleId: 13 },
                { userId: 2, articleId: 13 },
                { userId: 3, articleId: 13 },
                { userId: 2, articleId: 14 },
                { userId: 3, articleId: 14 },
                { userId: 4, articleId: 14 },
                { userId: 5, articleId: 14 },
                { userId: 6, articleId: 14 },
                { userId: 1, articleId: 15 },
                { userId: 1, articleId: 16 },
                { userId: 1, articleId: 20 },
                { userId: 1, articleId: 21 },
                { userId: 2, articleId: 21 },
                { userId: 3, articleId: 21 },
                { userId: 2, articleId: 22 },
                { userId: 3, articleId: 22 },
                { userId: 4, articleId: 22 },
                { userId: 5, articleId: 22 },
                { userId: 2, articleId: 23 },
                { userId: 3, articleId: 23 },
            ])
            .execute()
    }
}