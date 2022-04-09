import { ApiProperty } from "@nestjs/swagger";
import { ArticleObject } from "src/articles/response/getMain.response";

export abstract class SearchArticleResponseData {
  @ApiProperty()
  articles: ArticleObject
}

export abstract class SearchArticleResponse {
  @ApiProperty()
  data: SearchArticleResponseData
  
  @ApiProperty({example: "ok"})
  message: string
}

export abstract class SearchArticle404Response {
  @ApiProperty({example: "not found tag"})
  message: string
}