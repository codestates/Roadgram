import { ApiProperty } from "@nestjs/swagger";
import { CommentInfo } from "./createComment.response";

export abstract class ModifyCommentResponse {
  @ApiProperty()
  data: CommentInfo

  @ApiProperty({example: "comment modified"})
  message: string
}