import { ApiProperty } from "@nestjs/swagger";

export abstract class LogoutResponse {
  @ApiProperty({example: 'logout succeed'})
  message: string
}

export abstract class Logout404Response {
  @ApiProperty({example: 'cannot find user'})
  message: string
}