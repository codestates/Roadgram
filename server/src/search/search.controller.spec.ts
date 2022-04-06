
import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

const mockSearchService = () => ({
  searchArticle: jest.fn(),
})

describe('Search Controller', () => {
  let controller: SearchController;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService()
        }
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  it('1. controller.searchArticle 테스트', async () => {
    const tag = '테스트';
    const page = 1;
    controller.searchArticle(tag, page);
    expect(service.searchArticle).toBeDefined();
    expect(service.searchArticle).toBeCalledTimes(1);
  })
});