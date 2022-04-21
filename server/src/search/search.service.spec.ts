import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticlesService } from 'src/articles/articles.service';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { TagHitsRepository } from 'src/articles/repositories/tagHits.repository';
import { TrackRepository } from 'src/articles/repositories/track.repository';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

const mockRepository = () => ({
  getTagId: jest.fn(),
  getArticleIds: jest.fn(),
  searchArticle: jest.fn(),
  getUserId: jest.fn(),
  getUsername: jest.fn(),
  getProfileImage: jest.fn(),
  getTagIds: jest.fn(),
  getTagNameWithIds: jest.fn(),
  findId: jest.fn(),
  createTagHits: jest.fn(),
  addTagHits: jest.fn()
});

const tag = '테스트';
const page = 1;
const tagId = 5;
const articleIds = [5];
const articles = [
  {
    id: 5,
    userId: 2,
    nickname: 'test1',
    thumbnail: 'thumbnail1.jpg',
    profileImage: 'profile1.jpg',
    totalLike: 0,
    totalComment: 0,
    tags: ['테스트'],
    content: 'Test1 본문입니다',
    createdAt: '2022/04/01',
    updatedAt: '2022/04/01',
  },
];
const userId = articles[0].userId;
const writer = articles[0].nickname;
const profileImage = articles[0].profileImage;
const tagName = articles[0].tags[0];
const tagIds = [34];
const createdItem = {
  tagId: 32,
  tagName: '추가',
  id: 10,
  hits: 0,
  createdAt: "2022-04-18T07:33:54.000Z",
  updatedAt: "2022-04-18T07:33:54.000Z"
}

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;
describe('Search Service', () => {
  let service: SearchService;
  let articlesService: ArticlesService;
  let tagRepository: MockRepository<TagRepository>;
  let articleToTagRepository: MockRepository<ArticleToTagRepository>;
  let articleRepository: MockRepository<ArticleRepository>;
  let userRepository: MockRepository<UserRepository>;
  let trackRepository: MockRepository<TrackRepository>;
  let followRepository: MockRepository<FollowRepository>;
  let likesRepository: MockRepository<LikesRepository>;
  let tagHitsRepository: MockRepository<TagHitsRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        SearchService,
        ArticlesService,
        {
          provide: getRepositoryToken(TagRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ArticleToTagRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ArticleRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(TrackRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(FollowRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(LikesRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(TagHitsRepository),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    articlesService = module.get<ArticlesService>(ArticlesService);
    tagRepository = module.get(getRepositoryToken(TagRepository));
    articleToTagRepository = module.get(getRepositoryToken(ArticleToTagRepository),);
    articleRepository = module.get(getRepositoryToken(ArticleRepository));
    userRepository = module.get(getRepositoryToken(UserRepository));
    trackRepository = module.get(getRepositoryToken(TrackRepository))
    followRepository = module.get(getRepositoryToken(FollowRepository))
    likesRepository = module.get(getRepositoryToken(LikesRepository))
    tagHitsRepository = module.get(getRepositoryToken(TagHitsRepository))
  });

  describe('1. service.searchArticle 테스트', () => {
    beforeEach(async () => {
      tagRepository.getTagId.mockResolvedValue(tagId);
      articleToTagRepository.getArticleIds.mockResolvedValue(articleIds);
      articleRepository.searchArticle.mockResolvedValue(articles);
      articleRepository.getUserId.mockResolvedValue(userId);
      userRepository.getUsername.mockResolvedValue(writer);
      userRepository.getProfileImage.mockResolvedValue(profileImage);
      articleToTagRepository.getTagIds.mockResolvedValue(tagIds);
      tagRepository.getTagNameWithIds.mockResolvedValue(tagName);
      tagHitsRepository.createTagHits.mockResolvedValue(createdItem);
      tagHitsRepository.addTagHits.mockResolvedValue(true);
    });
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
          articles: [
            {
              id: articles[0].id,
              userId: articles[0].userId,
              thumbnail: articles[0].thumbnail,
              nickname: writer,
              profileImage,
              totalLike: articles[0].totalLike,
              totalComment: articles[0].totalComment,
              tags: articles[0].tags,
            },
          ],
        },
        message: successMessage,
      });
    });

    it('ERROR: 검색할 태그가 존재하지 않으면 Not Found Exception 반환.', async () => {
      const errorMessage = 'not found tag';
      try {
        tagRepository.getTagId.mockResolvedValueOnce(undefined);
        const result = await service.searchArticle(tag, page);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 해당 태그를 가진 게시물이 존재하지 않으면 Not Found Exception 반환.', async () => {
      const errorMessage = 'not found articles';
      try {
        articleToTagRepository.getArticleIds.mockResolvedValueOnce(undefined);
        const result = await service.searchArticle(tag, page);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 게시물에 대한 정보 조회 중 비정상 종료 시 Not Found Exception 반환.', async () => {
      const errorMessage = `not found article's contents`;
      try {
        articleRepository.getUserId.mockRejectedValue(undefined);
        const result = await service.searchArticle(tag, page);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });
  });
});
