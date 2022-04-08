import { ApiProperty } from "@nestjs/swagger";
import { ArticleInfo, UserInfo } from "./getArticleDetail.response";

export abstract class CreateArticleInfo extends ArticleInfo {
  constructor() {
    super()
  }
  @ApiProperty({isArray: true})
  comments: []
}

export abstract class CreateArticleResponseData {
  @ApiProperty()
  userInfo: UserInfo

  @ApiProperty()
  articleInfo: CreateArticleInfo
}

export abstract class CreateArticleResponse {
  @ApiProperty()
  data: CreateArticleResponseData

  @ApiProperty({example: "ok"})
  message: string
}

export abstract class CreateArticle400Response {
  @ApiProperty({example: "bad request"})
  message: string
}

export abstract class CreateArticle404Response {
  @ApiProperty({example: "not found user's information"})
  message: string
}
