import { ApiProperty } from "@nestjs/swagger";

export abstract class TotalComments {
  @ApiProperty({example: 5})
  totalComments: number
}

export abstract class DeleteCommentResponse {
  @ApiProperty()
  data: TotalComments

  @ApiProperty({example: 'comment deleted'})
  message: string
}

export abstract class DeleteComment404Response {
  @ApiProperty({example: 'the commment did not exist'})
  message: string
}