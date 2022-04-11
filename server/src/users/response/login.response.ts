import { ApiProperty } from "@nestjs/swagger";

export abstract class UserInfo {
  @ApiProperty({example: 5})
  id: number;

  @ApiProperty({example: "test@naver.com"})
  email: string;

  @ApiProperty({example: "Test계정"})
  nickname: string;

  @ApiProperty({example: "$!@)$)!SD)DKASD"})
  password: string;

  @ApiProperty({example: "So Good"})
  statusMessage: string;

  @ApiProperty({example: "Profile.jpg"})
  profileImage: string;

  @ApiProperty({example: 5})
  totalFollowing: number;

  @ApiProperty({example: 12})
  totalFollower: number;

  @ApiProperty({example: 1})
  loginMethod: number;

  @ApiProperty({example: null})
  refreshToken: string;

  @ApiProperty({example: "2022/04/01"})
  createdAt: Date;
}



export abstract class LoginResponseData {
  @ApiProperty({example: 'asdlpzxc1203-zxck'})
  accessToken: string

  @ApiProperty({example: 'as0d9o0zxckozxcks'})
  refreshToken: string

  @ApiProperty()
  userInfo: UserInfo
}

export abstract class LoginResponse {
  @ApiProperty()
  data: LoginResponseData

  @ApiProperty({example: 'login ok'})
  message: string
}

export abstract class Login404Response {
  @ApiProperty({example: 'login fail'})
  message: string
}