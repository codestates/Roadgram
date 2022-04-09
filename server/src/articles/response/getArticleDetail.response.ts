import { ApiProperty } from "@nestjs/swagger"
import { Double } from "typeorm"

export abstract class Road {
  @ApiProperty({example: "test_image.jpg"})
  imageSrc: string
  
  @ApiProperty({example: "테스트 장소"})
  placeName: string

  @ApiProperty({example: "테스트 주소"})
  addressName: string

  @ApiProperty({example: "153.332", type: Double})
  x: number

  @ApiProperty({example: "32.335", type: Double})
  y: number

}
export abstract class ArticleInfo {
  @ApiProperty({example: 5})
  id: number

  @ApiProperty({example: "thumnail.jpg"})
  thumbnail: string

  @ApiProperty({example: "Test본문"})
  content: string

  @ApiProperty({example: 0})
  totalLike: number

  @ApiProperty({example: 0})
  totalComment: number

  @ApiProperty({example: true})
  likedOrNot: boolean

  @ApiProperty({example: '2022/04/01'})
  createdAt: Date

  @ApiProperty({example: ["테스트", "엽기"], isArray: true})
  tags: []
  
  @ApiProperty()
  roads: Road
}

export abstract class UserInfo {
  @ApiProperty({example: 5})
  id: number

  @ApiProperty({example: "테스트 계정"})
  nickname: string

  @ApiProperty({example: "profile.jpg"})
  profileImage: string
}

export abstract class GetArticleDetailResponseData {
  @ApiProperty()
  userInfo: UserInfo
  
  @ApiProperty()
  articleInfo: ArticleInfo
}

export abstract class GetArticleDetailResponse {
  @ApiProperty()
  data: GetArticleDetailResponseData
  
  @ApiProperty({example: 'ok'})
  message: string
}

export abstract class GetArticleDetail404Response {
  @ApiProperty({example: `not found the article's contents`})
  message: string
}