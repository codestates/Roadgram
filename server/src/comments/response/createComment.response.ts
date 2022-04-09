import { ApiProperty } from "@nestjs/swagger"
import { UserInfo } from "src/articles/response/getArticleDetail.response"

export abstract class CommentInfo {
  @ApiProperty({example: 5})
  id: number
  
  @ApiProperty({example: "테스트 댓글입니다."})
  comment: string
  
  @ApiProperty({example: '2022/04/01'})
  createdAt: Date

  @ApiProperty({example: '2022/04/02'})
  updatedAt: Date
}

export abstract class CreateCommentResponseData {
  @ApiProperty()
  commentInfo: CommentInfo
  
  @ApiProperty({example: 10})
  totalComments: number

  @ApiProperty()
  writerInfo: UserInfo
}

export abstract class CreateCommentResponse {
  @ApiProperty()
  data: CreateCommentResponseData

  @ApiProperty({example: 'comment created'})
  message: string
}

export abstract class CreateComment404Response {
  @ApiProperty({example: 'the article does not exist'})
  message: string
}