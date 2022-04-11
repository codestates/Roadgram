import { ApiProperty } from "@nestjs/swagger";

export abstract class CheckEmailResponse {
  @ApiProperty({example: 'available'})
  message: string
}

export abstract class CheckEmail409Response {
  @ApiProperty({example: 'not available'})
  message: string
}