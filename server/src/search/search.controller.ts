import { Controller, Get, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchArticle404Response, SearchArticleResponse } from './response/searchArticle.response';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService){}
  @Get()
  @ApiOperation({summary: "태그 연관 게시물 조회", description: "유저가 입력한 태그와 연관된 게시물을 조회한다."})
  @ApiOkResponse({description: "입력된 태그 연관 게시물을 정상적으로 조회함", type: SearchArticleResponse})
  @ApiNotFoundResponse({description: "태그 정보를 찾을 수 없음", type: SearchArticle404Response})
  searchArticle(
    @Query('tag') tag: string,
    @Query('page') page: number
    ) {
    return this.searchService.searchArticle(tag, page);
  }
}
