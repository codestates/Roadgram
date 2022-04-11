import { ApiProperty } from "@nestjs/swagger"

export abstract class AccessToken {
  @ApiProperty({example: 'dadkosacko1020ckz'})
  accessToken: string
}
export abstract class RefreshAccessTokenResponse {
  @ApiProperty()
  data: AccessToken
  
  @ApiProperty({example: 'new access token'})
  message: string
}


export abstract class RefreshAccessToken401Response {
  @ApiProperty({example: 'refresh token expired'})
  message: string
}

export abstract class RefreshAccessToken404Response {
  @ApiProperty({example: 'cannot find user'})
  message: string
}

export abstract class RefreshAccessToken403Response {
  @ApiProperty({example: 'invalid token'})
  message: string
}