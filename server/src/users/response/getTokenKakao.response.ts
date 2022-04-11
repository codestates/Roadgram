import { ApiProperty } from "@nestjs/swagger"

export abstract class GetTokenKakaoUserInfo {
  @ApiProperty({example: 5})
  id: number

  @ApiProperty({example: "Test계정"})
  nickname: string

  @ApiProperty({example: 1})
  loginMethod: number

  @ApiProperty({example: "profile.jpg"})
  profileImage: string
}

export abstract class GetTokenKakaoResponseData {
  @ApiProperty({example: 'asdlpzxc1203-zxck'})
  accessToken: string

  @ApiProperty({example: 'as0d9o0zxckozxcks'})
  refreshToken: string

  @ApiProperty()
  userInfo: GetTokenKakaoUserInfo
}

export abstract class GetTokenKaKaoResponse {
  @ApiProperty()
  data: GetTokenKakaoResponseData

  @ApiProperty({example: 'login successfully'})
  message: string
}

export abstract class GetTokenKaKao401Response {
  @ApiProperty({example: 'permission denied'})
  message: string
}