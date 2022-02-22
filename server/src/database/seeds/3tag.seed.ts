import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateTag implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into("Tag")
            .values([
                { tagName: '서울' },
                { tagName: '부산' },
                { tagName: '경기' },
                { tagName: '제주도' },
                { tagName: '남대문' },
                { tagName: '데이트' },
                { tagName: '맛집' },
                { tagName: '경주' },
                { tagName: '여행' },
                { tagName: '올레길' },
                { tagName: '안압지' },
                { tagName: '첨성대' },
                { tagName: '불국사' },
                { tagName: '소갈비' },
                { tagName: '산정호수' },
                { tagName: '강화도' },
                { tagName: '펜션' },
                { tagName: '남산' },
                { tagName: '전망대' },
                { tagName: '여수' },
                { tagName: '돌게장' },
                { tagName: "강릉" },
                { tagName: "평창올림픽" },
                { tagName: '경복궁' },
                { tagName: '광화문광장' },
                { tagName: '북촌' },
                { tagName: '한옥' },
                { tagName: '해운대' },
                { tagName: '겨울바다' }
            ])
            .execute()
    }
}