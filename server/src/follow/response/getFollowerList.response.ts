import { ApiProperty } from "@nestjs/swagger";


export abstract class Followers {
  @ApiProperty({example: 5})
  id: number
  
  @ApiProperty({example: "Test 계정"})
  nickname: string

  @ApiProperty({example: "profile.jpg"})
  profileImage: string
}
export abstract class GetFollowerListResponse {
  @ApiProperty({isArray: true})
  data: Followers

  @ApiProperty({example: "follower list"})
  message: string
}
export abstract class GetFollowerList404Response {
  @ApiProperty({example: 'cannot find the user or followers'})
  message: string
}

export abstract class GetFollowerList406Response {
  @ApiProperty({example: 'unavailable page query'})
  message: string
}