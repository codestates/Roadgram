import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService){}
  @Get()
  searchArticle(
    @Query('tag') tag: string,
    @Query('page') page: number
    ) {
    return this.searchService.searchArticle(tag, page);
  }
}
