import { ApiProperty } from "@nestjs/swagger";
import { Article } from "src/articles/entities/article.entity";

export abstract class ArticleObject {
  @ApiProperty({example: 5})
  id: number

  @ApiProperty({example: 12})
  userId: number

  @ApiProperty({example: 'thumbnail.jpg'})
  thumbnail: string

  @ApiProperty({example: "테스트용"})
  nickname: string

  @ApiProperty({example: 5})
  totalLike: number

  @ApiProperty({example: 12})
  totalComment: number

  @ApiProperty({example: "profileImage.jpg"})
  profileImage: string

  @ApiProperty({isArray: true, example: ["바다", "해운대"]})
  tags: []
}

export abstract class Userinfo {
  @ApiProperty({example: 5})
  id: number

  @ApiProperty({example: "test@naver.com"})
  email: string

  @ApiProperty({example: "test"})
  nickname: string

  @ApiProperty({example: "So Good"})
  statusMessage: string

  @ApiProperty({example: "Profile.jpg"})
  profileImage: string

  @ApiProperty({example: 3})
  totalFollower: number

  @ApiProperty({example: 9})
  totalFollowing: number

  @ApiProperty({example: true})
  followedOrNot: boolean
}

export abstract class GetMypageResponseData {
  @ApiProperty()
  userInfo: Userinfo

  @ApiProperty({isArray: true})
  articles: ArticleObject
}

export abstract class GetMypageResponse {
  @ApiProperty()
  data: GetMypageResponseData

  @ApiProperty({example: 'ok'})
  message: string
}

export abstract class GetMypage404Response {
  @ApiProperty({example: 'No Content'})
  message: string
}