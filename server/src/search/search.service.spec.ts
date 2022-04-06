import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ArticleRepository } from "src/articles/repositories/article.repository"
import { ArticleToTagRepository } from "src/articles/repositories/article_tag.repository"
import { TagRepository } from "src/articles/repositories/tag.repository"
import { UserRepository } from "src/users/repositories/user.repository"
import { getRepository } from "typeorm"
import { SearchController } from "./search.controller"
import { SearchService } from "./search.service"

const mockRepository = () => ({
  getTagId: jest.fn(),
  getArticleIds: jest.fn(),
  searchArticle: jest.fn(),
  getUserId: jest.fn(),
  getUsername: jest.fn(),
  getProfileImage: jest.fn(),
  getTagIds: jest.fn(),
  getTagNameWithIds: jest.fn(),
})

const tag = "테스트";
const page = 1;
const tagId = 5;
const articleIds = [5];
const articles = [
  {
    id: 5,
    userId: 2,
    nickname: "test1",
    thumbnail: 'thumbnail1.jpg',
    profileImage: "profile1.jpg",
    totalLike: 0,
    totalComment: 0,
    tags: ["테스트"],
    content: "Test1 본문입니다",
    createdAt: '2022/04/01',
    updatedAt: '2022/04/01'
  }
];
const userId = articles[0].userId;
const writer = articles[0].nickname;
const profileImage = articles[0].profileImage;
const tagName = articles[0].tags[0];
const tagIds = [34];

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;
describe('Search Service', () => {
  let service: SearchService;
  let tagRepository: MockRepository<TagRepository>;
  let articleToTagRepository: MockRepository<ArticleToTagRepository>;
  let articleRepository: MockRepository<ArticleRepository>;
  let userRepository: MockRepository<UserRepository>;
  beforeEach(async ()=> {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        SearchService,
        {
          provide: getRepositoryToken(TagRepository),
          useValue: mockRepository()
        },
        {
          provide: getRepositoryToken(ArticleToTagRepository),
          useValue: mockRepository()
        },
        {
          provide: getRepositoryToken(ArticleRepository),
          useValue: mockRepository()
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockRepository()
        },
      ]
    }).compile();

    service = module.get<SearchService>(SearchService);
    tagRepository = module.get(getRepositoryToken(TagRepository));
    articleToTagRepository = module.get(getRepositoryToken(ArticleToTagRepository));
    articleRepository = module.get(getRepositoryToken(ArticleRepository));
    userRepository = module.get(getRepositoryToken(UserRepository));
  })
  
  describe("1. service.searchArticle 테스트", () => {
    beforeEach(async () => {
      tagRepository.getTagId.mockResolvedValue(tagId);
      articleToTagRepository.getArticleIds.mockResolvedValue(articleIds);
      articleRepository.searchArticle.mockResolvedValue(articles);
      articleRepository.getUserId.mockResolvedValue(userId);
      userRepository.getUsername.mockResolvedValue(writer);
      userRepository.getProfileImage.mockResolvedValue(profileImage);
      articleToTagRepository.getTagIds.mockResolvedValue(tagIds);
      tagRepository.getTagNameWithIds.mockResolvedValue(tagName);
    })
    it('SUCCESS: 태그 검색한 게시물을 정상적으로 조회한다.', async () => {
      const successMessage = 'ok';
      const result = await service.searchArticle(tag, page);

      expect(tagRepository.getTagId).toBeCalledTimes(1);
      expect(articleToTagRepository.getArticleIds).toBeCalledTimes(1);
      expect(articleRepository.searchArticle).toBeCalledTimes(1);
      expect(articleRepository.getUserId).toBeCalledTimes(1);
      expect(userRepository.getUsername).toBeCalledTimes(1);
      expect(userRepository.getProfileImage).toBeCalledTimes(1);
      expect(articleToTagRepository.getTagIds).toBeCalledTimes(1);
      expect(tagRepository.getTagNameWithIds).toBeCalledTimes(1);
      expect(result).toStrictEqual({
        data: {
          articles: [{
            id: articles[0].id,
            userId: articles[0].userId,
            thumbnail: articles[0].thumbnail,
            nickname: writer,
            profileImage,
            totalLike: articles[0].totalLike,
            totalComment: articles[0].totalComment,
            tags: articles[0].tags
          }]
        },
        message: successMessage
      });  
    })

    it('ERROR: 검색할 태그가 존재하지 않으면 Not Found Exception을 반환.', async () => {
      const errorMessage = 'cannot find tag';
      try {
        tagRepository.getTagId.mockResolvedValueOnce(undefined)
        const result = await service.searchArticle(tag, page);  
        expect(result).toBeDefined();
      } catch(err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    })

    it('ERROR: 해당 태그를 가진 게시물이 존재하지 않으면 Not Found Exception을 반환.', async () => {
      const errorMessage = 'cannot find articles';
      try {
        articleToTagRepository.getArticleIds.mockResolvedValueOnce(undefined)
        const result = await service.searchArticle(tag, page);  
        expect(result).toBeDefined();
      } catch(err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    })

    it('ERROR: 태그 조회가 비정상적으로 종료될 경우 Server Error 반환.', async () => {
      const errorMessage = 'server error';
      try {
        tagRepository.getTagId.mockRejectedValue('error');
        const result = await service.searchArticle(tag, page);  
        expect(result).toBeDefined();
      } catch(err) {
        expect(err.status).toBe(500);
        expect(err.response.message).toBe(errorMessage);
      }
    })

  })
})