import { ApiProperty } from "@nestjs/swagger";

export abstract class SignupResponse {
  @ApiProperty({example: "signup succeed"})
  message: string
}