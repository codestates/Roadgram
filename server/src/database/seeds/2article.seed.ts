import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateArticle implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into('Article')
            .values([
                { userId: 1, content: "희망도 없고 꿈도 없이", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%A7%E1%86%BC%E1%84%87%E1%85%A9%E1%86%A8%E1%84%80%E1%85%AE%E1%86%BC.jpeg", totalLike: 3, totalComment: 2 },
                { userId: 2, content: "사랑에 속고 돈에 울고", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%AA%E1%86%BC%E1%84%92%E1%85%AA%E1%84%86%E1%85%AE%E1%86%AB%E1%84%80%E1%85%AA%E1%86%BC%E1%84%8C%E1%85%A1%E1%86%BC.jpeg", totalLike: 2 },
                { userId: 1, content: "기막힌 세상 돌아보면", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%87%E1%85%AE%E1%86%A8%E1%84%8E%E1%85%A9%E1%86%AB.webp", totalLike: 1, totalComment: 1 },
                { userId: 3, content: "서러움에 눈물이나", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%A7%E1%86%BC%E1%84%8C%E1%85%AE+%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%A1%E1%86%B8%E1%84%8C%E1%85%B5.jpg", totalLike: 0, totalComment: 5 },
                { userId: 4, content: "비겁하다 욕하지마", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%A5%E1%86%BC%E1%84%89%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%B5%E1%86%AF%E1%84%8E%E1%85%AE%E1%86%AF%E1%84%87%E1%85%A9%E1%86%BC.jpg", totalLike: 5 },
                { userId: 5, content: "더러운 뒷골목을 헤메고 다녀도", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%92%E1%85%A2%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%83%E1%85%A2.jpg", totalLike: 0, totalComment: 4 },
                { userId: 1, content: "내 상처를 끌어안을 그대가", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%83%E1%85%A2%E1%84%86%E1%85%AE%E1%86%AB.jpg", totalLike: 1 },
                { userId: 2, content: "곁에 있어 행복했다", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%A1%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%92%E1%85%A9%E1%84%89%E1%85%AE.jpg", totalLike: 2 },
                { userId: 5, content: "촛불처럼 짧은 사랑", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%AA%E1%86%BC%E1%84%8C%E1%85%A1%E1%86%BC%E1%84%89%E1%85%B5%E1%84%8C%E1%85%A1%E1%86%BC.jpeg", totalLike: 5, totalComment: 3 },
                { userId: 4, content: "내 한몸 아낌없이 바치려 했건만", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%A1%E1%86%BC%E1%84%92%E1%85%AA%E1%84%83%E1%85%A9.jpg", totalLike: 0 },
                { userId: 3, content: "저 하늘이 외면하는 그 순간", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%8C%E1%85%A6%E1%84%8C%E1%85%AE%E1%84%83%E1%85%A9+%E1%84%8B%E1%85%A9%E1%86%AF%E1%84%85%E1%85%A6%E1%84%80%E1%85%B5%E1%86%AF.jpg", totalLike: 4, totalComment: 1 },
                { userId: 2, content: "내 생에 봄날은 간다", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%85%E1%85%A9%E1%86%BA%E1%84%83%E1%85%A6%E1%84%8B%E1%85%AF%E1%86%AF%E1%84%83%E1%85%B3.webp", totalLike: 3 },
                { userId: 5, content: "가나다라", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A1%E1%84%83%E1%85%A9%E1%86%BC.webp", totalLike: 3 },
                { userId: 1, content: "마바사", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%8E%E1%85%A5%E1%86%BC%E1%84%80%E1%85%A8%E1%84%8E%E1%85%A5%E1%86%AB.webp", totalLike: 5 },
                { userId: 5, content: "아자차카", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%92%E1%85%A1%E1%86%AB%E1%84%80%E1%85%A1%E1%86%BC.webp", totalLike: 1 },
                { userId: 2, content: "타파하", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%85%E1%85%A9%E1%86%BA%E1%84%83%E1%85%A6%E1%84%90%E1%85%A1%E1%84%8B%E1%85%AF.webp", totalLike: 1, totalComment: 1 },
                { userId: 1, content: "아야어여", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%8C%E1%85%AE%E1%86%BC%E1%84%85%E1%85%A1%E1%86%BC%E1%84%8E%E1%85%A5%E1%86%AB.jpg", totalLike: 0 },
                { userId: 3, content: "오요우유", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/ddp.jpg", totalLike: 0 },
                { userId: 2, content: "으이", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%86%E1%85%A6%E1%86%BC%E1%84%83%E1%85%A9%E1%86%BC.jpeg", totalLike: 0 },
                { userId: 4, content: "자축인묘", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%89%E1%85%A1%E1%86%AB.jpeg", totalLike: 1, totalComment: 4 },
                { userId: 5, content: "진사오미", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%8B%E1%85%A7%E1%84%89%E1%85%AE.jpg", totalLike: 3 },
                { userId: 1, content: "신유술해", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%A1%E1%86%BC%E1%84%85%E1%85%B3%E1%86%BC.jpg", totalLike: 4 },
                { userId: 1, content: "갑을병정", thumbnail: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%87%E1%85%AE%E1%86%A8%E1%84%92%E1%85%A1%E1%86%AB%E1%84%89%E1%85%A1%E1%86%AB.jpeg", totalLike: 2 },
            ])
            .execute()
    }
}