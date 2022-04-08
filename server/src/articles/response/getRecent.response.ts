import { ApiProperty } from "@nestjs/swagger"
import { ArticlesData } from "./getMain.response"

export abstract class GetRecentResponse {
  @ApiProperty()
  data: ArticlesData
  
  @ApiProperty({example: "ok"})
  message: string
}

export abstract class GetRecent401Response {
  @ApiProperty({example: 'permisson denied'})
  message: string
}

export abstract class GetRecent404Response {
  @ApiProperty({example: 'not found following ids'})
  message: string
}