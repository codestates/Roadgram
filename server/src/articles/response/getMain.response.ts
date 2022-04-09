import { ApiProperty } from "@nestjs/swagger";

export abstract class ArticleObject {
  @ApiProperty({example: 5})
  id: number
  
  @ApiProperty({example: 3})
  userId: number

  @ApiProperty({example: 'thumbnail.jpg'})
  thumbnail: string

  @ApiProperty({example: "테스트 계정"})
  nickname: string

  @ApiProperty({example: "profile.jpg"})
  profileImage: string
  
  @ApiProperty({example: 3})
  totalLike: number

  @ApiProperty({example: 5})
  totalComment: number
  
  @ApiProperty({example: {order: 1, tagName: "테스트"}})
  tags: Object[] | []
};

export abstract class ArticlesData {
  @ApiProperty()
  articles: ArticleObject
};

export abstract class GetMainResponse {
  @ApiProperty()
  data: ArticlesData
  
  @ApiProperty({example: "ok"})
  message: string
}

export abstract class GetMain401Response {
  @ApiProperty({example: 'permisson denied'})
  message: string
}

export abstract class GetMain404Response {
  @ApiProperty({example: 'not found following ids'})
  message: string
}