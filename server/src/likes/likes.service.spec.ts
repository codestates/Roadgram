import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { Likes } from './entities/likes.entity';
import { LikesService } from './likes.service';
import { LikesRepository } from './repositories/likes.repository';

describe('LikesService', () => {
  let service: LikesService;
  let likesRepository: MockRepository<Likes>;
  let articleRepository: MockRepository<Article>;
  let total_likes = 2;

  type MockRepository<T = any> = Partial<Record<any, jest.Mock>>;

  const mockLikesRepository = () => ({
    likeOrNot: jest.fn(),
    likeArticle: jest.fn().mockImplementation(() => 'like this post'),
    unlikeArticle: jest.fn().mockImplementation(() => 'unlike this post')
  });

  const mockArticleRepository = () => ({
    likeIncrement: jest.fn().mockImplementation(() => total_likes + 1),
    likeDecrement: jest.fn().mockImplementation(() => total_likes - 1)
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: getRepositoryToken(LikesRepository),
          useValue: mockLikesRepository()
        },
        {
          provide: getRepositoryToken(ArticleRepository),
          useValue: mockArticleRepository()
        }
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    likesRepository = module.get(getRepositoryToken(LikesRepository));
    articleRepository = module.get(getRepositoryToken(ArticleRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('likeUnlike 테스트', () => {
    it('SUCCESS: 게시물에 좋아요 추가에 대한 응답 반환', async () => {
      likesRepository.likeOrNot.mockResolvedValue(false);

      const likesDto = {
        loginMethod: 0,
        user: 1,
        articleId: 2
      };

      const expectedResult = {
        data: {
          articleId: likesDto.articleId,
          totalLikes: 3
        },
        message: 'like this post'
      };

      const result = await service.likeUnlike(likesDto);

      expect(likesRepository.likeOrNot).toHaveReturned();
      expect(likesRepository.likeArticle).toHaveBeenCalled();
      expect(articleRepository.likeIncrement).toHaveBeenCalled();
      expect(likesRepository.unlikeArticle).toBeCalledTimes(0);
      expect(articleRepository.likeDecrement).toBeCalledTimes(0);
      expect(result.data).toEqual(expectedResult.data);
      expect(result.message).toEqual(expectedResult.message);
    });

    it('SUCCESS: 게시물에 좋아요 취소에 대한 응답 반환', async () => {
      likesRepository.likeOrNot.mockResolvedValue(true);

      const likesDto = {
        loginMethod: 0,
        user: 1,
        articleId: 2
      };

      const expectedResult = {
        data: {
          articleId: likesDto.articleId,
          totalLikes: 1
        },
        message: 'unlike this post'
      };

      const result = await service.likeUnlike(likesDto);

      expect(likesRepository.likeOrNot).toHaveReturned();
      expect(likesRepository.likeArticle).toBeCalledTimes(0);
      expect(articleRepository.likeIncrement).toBeCalledTimes(0);
      expect(likesRepository.unlikeArticle).toHaveBeenCalled();
      expect(articleRepository.likeDecrement).toHaveBeenCalled();
      expect(result.data).toEqual(expectedResult.data);
      expect(result.message).toEqual(expectedResult.message);
    });

    it('ERROR: 존재하지 않는 게시물 ID의 좋아요 요청에 대한 에러 반환', async () => {
      likesRepository.likeOrNot.mockResolvedValue(undefined);

      const likesDto = {
        loginMethod: 0,
        user: 1,
        articleId: 99
      };

      try {
        await service.likeUnlike(likesDto);
      } catch (err) {
        expect(likesRepository.likeOrNot).toHaveBeenCalled();
        expect(likesRepository.likeArticle).toBeCalledTimes(0);
        expect(articleRepository.likeIncrement).toBeCalledTimes(0);
        expect(likesRepository.unlikeArticle).toBeCalledTimes(0);
        expect(articleRepository.likeDecrement).toBeCalledTimes(0);
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.status).toBe(404);
        expect(err.response.message).toEqual(`no article with ID ${likesDto.articleId}`);
      }
    });
  });
});
