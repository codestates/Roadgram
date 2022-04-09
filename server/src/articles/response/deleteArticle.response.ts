import { ApiProperty } from "@nestjs/swagger";

export abstract class DeleteArticleResponse {
  @ApiProperty({example: 'article deleted'})
  message: string
}

export abstract class DeleteArticle404Response {
  @ApiProperty({example: 'not found article you wanted to delete'})
  message: string
}