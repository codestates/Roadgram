import { ApiProperty } from "@nestjs/swagger"

export abstract class Followings {
  @ApiProperty({example: 5})
  id: number
  
  @ApiProperty({example: "Test 계정"})
  nickname: string

  @ApiProperty({example: "profile.jpg"})
  profileImage: string
}
export abstract class GetFollowingListResponse {
  @ApiProperty({isArray: true})
  data: Followings

  @ApiProperty({example: "following list"})
  message: string
}
export abstract class GetFollowingList404Response {
  @ApiProperty({example: 'cannot find the user or followings'})
  message: string
}

export abstract class GetFollowingList406Response {
  @ApiProperty({example: 'unavailable page query'})
  message: string
}