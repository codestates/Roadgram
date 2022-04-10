import { ApiProperty } from "@nestjs/swagger"

export abstract class FollowResult {
  @ApiProperty({example: 5})
  id: number

  @ApiProperty({example: 10})
  totalFollower: number
}

export enum FollowUnFollowMessage {
  follow = 'followed this user',
  unfollow =  'unfollowed this user'
}

export abstract class FollowUnfollowResponse {
  @ApiProperty()
  data: FollowResult

  @ApiProperty({enum: FollowUnFollowMessage})
  message: FollowUnFollowMessage
}

export abstract class FollowUnfollow404Response {
  @ApiProperty({example: 'no user with ID 5'})
  message: string
}