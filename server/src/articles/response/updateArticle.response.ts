import { ApiProperty } from "@nestjs/swagger";
import { Road, UserInfo } from "./getArticleDetail.response";

export abstract class UpdateArticleInfo {
  @ApiProperty({example: 5})
  id: number
  
  @ApiProperty({example: "테스트 본문"})
  content: string 
  
  @ApiProperty({example: 0})
  totalComment: number 
  
  @ApiProperty({example: 3})
  totalLike: number 
  
  @ApiProperty({example: 5})
  userId: number

  @ApiProperty()
  roads: Road
}

export abstract class UpdateArticleResponseData {
  @ApiProperty()
  userInfo: UserInfo

  @ApiProperty()
  articleInfo: UpdateArticleInfo
}

export abstract class UpdateArticleResponse {
  @ApiProperty()
  data: UpdateArticleResponseData

  @ApiProperty({example: "ok"})
  message: string
}

export abstract class UpdateArticle400Response {
  @ApiProperty({example: "bad request, a task was cancelled"})
  message: string
}

export abstract class UpdateArticle404Response {
  @ApiProperty({example: "not found article's contents"})
  message: string
}
