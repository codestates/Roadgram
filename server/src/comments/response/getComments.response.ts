import { ApiProperty } from "@nestjs/swagger";
import { CommentInfo } from "./createComment.response";

export abstract class GetCommentsResponseData {
  @ApiProperty({example: 5})
  id: number

  @ApiProperty({example: 10})
  userId: number

  @ApiProperty({example: "test_image.jpg"})
  profileImage: string

  @ApiProperty({example: "테스트계정"})
  nickname: string

  @ApiProperty({example: "좋아요!"})
  comment: string

  @ApiProperty({example: "2022/04/01"})
  createdAt: Date
}

export abstract class GetCommentsResponse {
  @ApiProperty()
  data: GetCommentsResponseData

  @ApiProperty({example: `all comments of article Id: 5`})
  message: string
}

export abstract class GetComments406Response {
  @ApiProperty({example: 'unavailable page query'})
  message: string
}

export abstract class GetComments404Response {
  @ApiProperty({example: 'no comments yet'})
  message: string
}