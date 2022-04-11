import { ApiProperty } from "@nestjs/swagger";

export abstract class CheckNicknameResponse {
  @ApiProperty({example: 'available'})
  message: string
}

export abstract class CheckNickname409Response {
  @ApiProperty({example: 'not available'})
  message: string
}