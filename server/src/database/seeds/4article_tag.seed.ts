import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateArticleTag implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into("Article_tag")
            .values([
                { articleId: 4, tagId: 8, order: 1 },
                { articleId: 4, tagId: 11, order: 2 },
                { articleId: 4, tagId: 12, order: 3 },
                { articleId: 4, tagId: 13, order: 4 },
                { articleId: 4, tagId: 14, order: 5 },
                { articleId: 11, tagId: 4, order: 1 },
                { articleId: 11, tagId: 10, order: 2 },
                { articleId: 1, tagId: 1, order: 1 },
                { articleId: 2, tagId: 1, order: 1 },
                { articleId: 3, tagId: 1, order: 1 },
                { articleId: 6, tagId: 2, order: 1 },
                { articleId: 6, tagId: 7, order: 2 },
                { articleId: 5, tagId: 4, order: 1 },
                { articleId: 7, tagId: 1, order: 1 },
                { articleId: 7, tagId: 5, order: 2 },
                { articleId: 7, tagId: 6, order: 3 },
                { articleId: 8, tagId: 3, order: 1 },
                { articleId: 8, tagId: 15, order: 2 },
                { articleId: 9, tagId: 7, order: 1 },
                { articleId: 10, tagId: 16, order: 1 },
                { articleId: 10, tagId: 17, order: 2 },
                { articleId: 10, tagId: 9, order: 3 },
                { articleId: 12, tagId: 1, order: 1 },
                { articleId: 13, tagId: 1, order: 1 },
                { articleId: 14, tagId: 1, order: 1 },
                { articleId: 15, tagId: 1, order: 1 },
                { articleId: 16, tagId: 1, order: 1 },
                { articleId: 17, tagId: 1, order: 1 },
                { articleId: 18, tagId: 1, order: 1 },
                { articleId: 19, tagId: 1, order: 1 },
                { articleId: 20, tagId: 18, order: 1 },
                { articleId: 20, tagId: 19, order: 2 },
                { articleId: 21, tagId: 20, order: 1 },
                { articleId: 21, tagId: 21, order: 2 },
                { articleId: 22, tagId: 22, order: 1 },
                { articleId: 22, tagId: 23, order: 2 },
                { articleId: 1, tagId: 24, order: 2 },
                { articleId: 2, tagId: 25, order: 2 },
                { articleId: 3, tagId: 26, order: 2 },
                { articleId: 3, tagId: 27, order: 3 },
                { articleId: 3, tagId: 6, order: 4 },
                { articleId: 6, tagId: 28, order: 3 },
                { articleId: 6, tagId: 29, order: 4 },
            ])
            .execute()
    }
}