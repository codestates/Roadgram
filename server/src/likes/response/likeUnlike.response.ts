import { ApiProperty } from "@nestjs/swagger";

export abstract class LikeUnlikeResponseData {
  @ApiProperty({example: 5})
  articleId: number
  
  @ApiProperty({example: 15})
  totalLikes: number
}

export enum LikeOrUnLike {
  like = 'like this post',
  unlike = 'unlike this post'
}

export abstract class LikeUnLikeResponse {
  @ApiProperty()
  data: LikeUnlikeResponseData

  @ApiProperty({enum: LikeOrUnLike})
  message: LikeOrUnLike
}

export abstract class LikeUnLike404Response {
  @ApiProperty({example: 'no article with ID 5'})
  message: string
}