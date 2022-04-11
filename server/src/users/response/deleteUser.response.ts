import { ApiProperty } from "@nestjs/swagger";

export abstract class DeleteUserResponse {
  @ApiProperty({example: 'withdrawal succeed'})
  message: string
}