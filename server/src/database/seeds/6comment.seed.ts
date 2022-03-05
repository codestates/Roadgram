import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateComment implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into("Comments")
            .values([
                { comment: "그대 기억이", articleId: 1, userId: 2 },
                { comment: "지난 사랑이", articleId: 1, userId: 4 },
                { comment: "내 안을 파고드는", articleId: 3, userId: 3 },
                { comment: "가시가 되어", articleId: 4, userId: 1 },
                { comment: "제발 가라고", articleId: 4, userId: 2 },
                { comment: "아주 가라고", articleId: 4, userId: 4 },
                { comment: "애써도 나를", articleId: 4, userId: 5 },
                { comment: "괴롭히는데", articleId: 4, userId: 6 },
                { comment: "붉은색 푸른색", articleId: 6, userId: 3 },
                { comment: "그 사이 3초 그 짧은 시간", articleId: 6, userId: 1 },
                { comment: "노란 색 빛을 내는", articleId: 6, userId: 2 },
                { comment: "저기 저 신호등이", articleId: 6, userId: 6 },
                { comment: "내마음 속을 텅", articleId: 9, userId: 1 },
                { comment: "비워버려 내가 빠른지도", articleId: 9, userId: 2 },
                { comment: "느린지도 모르겠어", articleId: 9, userId: 3 },
                { comment: "그저 내 맘이", articleId: 11, userId: 1 },
                { comment: "샛노랄 뿐야", articleId: 16, userId: 5 },
                { comment: "비린내나는 부둣가를", articleId: 20, userId: 6 },
                { comment: "내 세상처럼 누벼가며", articleId: 20, userId: 2 },
                { comment: "두 주먹으로 또 하루를", articleId: 20, userId: 1 },
                { comment: "겁없이 살아간다", articleId: 20, userId: 3 },
            ])
            .execute()
    }
}