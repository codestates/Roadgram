import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken} from '@nestjs/typeorm';
import { CommentRepository } from 'src/comments/repositories/comments.repository';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersService } from 'src/users/users.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticleRepository } from './repositories/article.repository';
import { ArticleToTagRepository } from './repositories/article_tag.repository';
import { TagRepository } from './repositories/tag.repository';
import { TagHitsRepository } from './repositories/tagHits.repository';
import { TrackRepository } from './repositories/track.repository';

const mockArticleRepository = () => ({
  getArticleInfo: jest.fn(),
  getUserId: jest.fn(),
  createArticle: jest.fn(),
  deleteArticle: jest.fn(),
  getArticleDetail: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  addArticleHits: jest.fn(),
  addTagHits: jest.fn()
});

const mockFollowRepository = () => ({
  getFollowingIds: jest.fn(),
});

const mockUserRepository = () => ({
  getFollowingIds: jest.fn(),
  getUsername: jest.fn(),
  getProfileImage: jest.fn(),
  findOne: jest.fn(),
  getUserInfo: jest.fn(),
});

const mockArticleToTagRepository = () => ({
  getTagIds: jest.fn(),
  find: jest.fn(),
  getRoads: jest.fn(),
  deleteTags: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockTagRepository = () => ({
  getTagNameWithIds: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockTrackRepository = () => ({
  createTrack: jest.fn(),
  getRoads: jest.fn(),
});

const mockLikesRepository = () => ({
  likeOrNot: jest.fn(),
});

const mockTagHitsRepository = () => ({
  createTagHits: jest.fn(),
  addTagHits: jest.fn(),
  findOne: jest.fn(),
  getPopularTag: jest.fn()
});

const userId = 1;
const articleId = 5;
const page = 1;
const articles = {
  id: 6,
  userId: 5,
  thumbnail: 'thumbnail.jpg',
  nickname: '테스트용 계정',
  profileImage: 'profileImage.jpg',
  totalLike: 5,
  totalComment: 3,
  tags: [
    {
      tagName: '테스트',
      order: 1,
    },
    {
      tagName: '엽기',
      order: 2,
    },
  ],
};
const createArticleDto = {
  user: 5,
  road: [
    {
      order: 1,
      imgSrc: 'busan.jpg',
      address: '부산 해운대',
      name: '부산',
      x: '123.323',
      y: '53.212',
    },
  ],
  tag: [
    {
      tagName: '테스트',
      order: 1,
    },
    {
      tagName: '엽기',
      order: 2,
    },
  ],
  content: '본문입니다.',
  thumbnail: 'thumbnail.png',
  loginMethod: 1,
};

const userInfo = {
  id: 5,
  nickname: 'test',
  profileImage: 'testProfile.jpg',
};

const createdArticle = {
  data: {
    userInfo,
    articleInfo: {
      id: articleId,
      totalLike: 0,
      totalComment: 0,
      roads: createArticleDto.road,
      tags: createArticleDto.tag.map((each) => each.tagName),
      comments: [],
    },
  },
  message: 'article created',
};

const updateArticleDto: UpdateArticleDto = {
  loginMethod: 1,
  user: 3,
  articleId: 5,
  content: '테스트 본문입니다.',
};

const articleInfo = {
  ...articles,
  content: 'Test 본문입니다.',
  createdAt: '2022/04/01',
};
const likedOrNot = true;
const tagIds = [33];
const tagName = '부산';
const roads = createArticleDto.road;
const article = {
  id: articleInfo.id,
  thumbnail: articleInfo.thumbnail,
  content: articleInfo.content,
  totalLike: articleInfo.totalLike,
  totalComment: articleInfo.totalComment,
  likedOrNot: likedOrNot,
  tags: [tagName],
  roads,
  createdAt: articleInfo.createdAt,
};
const lastTags = [
  {
    tagId: 1,
    order: 1,
  },
  {
    tagId: 2,
    order: 2,
  },
];

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('Articles Service', () => {
  let service: ArticlesService;
  let articleRepository: MockRepository<ArticleRepository>;
  let followRepository: MockRepository<FollowRepository>;
  let userRepository: MockRepository<UserRepository>;
  let tagRepository: MockRepository<TagRepository>;
  let articleToTagRepository: MockRepository<ArticleToTagRepository>;
  let trackRepository: MockRepository<TrackRepository>;
  let likesRepository: MockRepository<LikesRepository>;
  let tagHitsRepository: MockRepository<TagHitsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        ArticlesService,
        UsersService,
        CommentRepository,
        {
          provide: getRepositoryToken(ArticleRepository),
          useValue: mockArticleRepository(),
        },
        {
          provide: getRepositoryToken(FollowRepository),
          useValue: mockFollowRepository(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository(),
        },
        {
          provide: getRepositoryToken(ArticleToTagRepository),
          useValue: mockArticleToTagRepository(),
        },
        {
          provide: getRepositoryToken(TagRepository),
          useValue: mockTagRepository(),
        },
        {
          provide: getRepositoryToken(TrackRepository),
          useValue: mockTrackRepository(),
        },
        {
          provide: getRepositoryToken(LikesRepository),
          useValue: mockLikesRepository(),
        },
        {
          provide: getRepositoryToken(TagHitsRepository),
          useValue: mockTagHitsRepository(),
        },
      ],
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articleRepository = module.get(getRepositoryToken(ArticleRepository));
    followRepository = module.get(getRepositoryToken(FollowRepository));
    userRepository = module.get(getRepositoryToken(UserRepository));
    tagRepository = module.get(getRepositoryToken(TagRepository));
    articleToTagRepository = module.get(
      getRepositoryToken(ArticleToTagRepository),
    );
    trackRepository = module.get(getRepositoryToken(TrackRepository));
    likesRepository = module.get(getRepositoryToken(LikesRepository));
    tagHitsRepository = module.get(getRepositoryToken(TagHitsRepository));
  });

  describe('1. getMain 테스트', () => {
    beforeEach(async () => {
      const getFollowing = [2];
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
      followRepository.getFollowingIds.mockResolvedValue(getFollowing);
      articleRepository.getArticleInfo.mockResolvedValue(articles);
      articleRepository.getUserId.mockResolvedValue(userId);
      userRepository.getUsername.mockResolvedValue(writer);
      userRepository.getProfileImage.mockResolvedValue(profileImage);
      articleToTagRepository.getTagIds.mockResolvedValue(tagIds);
      tagRepository.getTagNameWithIds.mockResolvedValue(tagName);
    });
    it('SUCCESS: 메인페이지가 정상 조회됨', async () => {
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
      const successMessage = 'ok';
      const result = await service.getMain(userId, page);
      expect(followRepository.getFollowingIds).toBeCalledTimes(1);
      expect(articleRepository.getArticleInfo).toBeCalledTimes(1);
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
    it('ERROR: 게시물에 대한 정보 조회 중 비정상 종료 시 Not Found Exception 반환.', async () => {
      const errorMessage = 'not found articles contents';
      try {
        articleRepository.getUserId.mockRejectedValue(undefined);
        const result = await service.getMain(userId, page);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 팔로잉을 찾을 수 없을 경우 Unauthorized Exception 반환', async () => {
      const errorMessage = 'permisson denied';
      try {
        followRepository.getFollowingIds.mockResolvedValue(undefined);
        const result = await service.getMain(userId, page);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(401);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 팔로잉이 0명일 경우 Not Found Exception 반환', async () => {
      const errorMessage = 'not found following ids'
      try {
        followRepository.getFollowingIds.mockResolvedValue([]);
        const result = await service.getMain(userId, page);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 팔로워의 게시물이 0개일 경우 Not Found Exception 반환', async () => {
      const errorMessage = 'not found articles'
      try {
        articleRepository.getArticleInfo.mockResolvedValue([]);
        const result = await service.getMain(userId, page);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });
  });

  describe('2. getRecent 테스트', () => {
    beforeEach(async () => {
      const articles = [
        {
          id: 5,
          userId: 2,
          thumbnail: 'thumbnail1.jpg',
          nickname: 'test1',
          profileImage: 'profile1.jpg',
          totalLike: 0,
          totalComment: 0,
          tags: ['테스트', '엽기'],
        },
        {
          id: 6,
          userId: 3,
          thumbnail: 'thumbnail2.jpg',
          nickname: 'test2',
          profileImage: 'profile2.jpg',
          totalLike: 0,
          totalComment: 0,
          tags: ['부산', '해운대'],
        },
      ];
      const tagIds = [34, 35];
      articleRepository.getArticleInfo.mockResolvedValue(articles);
      articleRepository.getUserId.mockResolvedValue(articles[0].userId);
      userRepository.getUsername.mockRejectedValue(articles[0].nickname);
      userRepository.getProfileImage.mockResolvedValue(
        articles[0].profileImage,
      );
      articleToTagRepository.getTagIds.mockResolvedValue(tagIds);
      tagRepository.getTagNameWithIds.mockRejectedValue(articles[0].tags[0]);
    });
    it('SUCCESS: 메인페이지가 최신순으로 정상 조회됨', async () => {
      jest.spyOn(service, 'getRecent').mockResolvedValue(articles);
      const result = await service.getRecent(page);
      expect(result).toStrictEqual(articles);
    });

    it('ERROR: 게시물이 없을 경우 Not Found Exception 반환', async () => {
      const errorMessage = 'not found articles'
      try {
        articleRepository.getArticleInfo.mockResolvedValue(undefined);
        const result = await service.getRecent(page);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 게시물에 대한 정보 조회 중 비정상 종료 시 Not Found Exception 반환.', async () => {
      const errorMessage = 'not found articles contents';
      try {
        articleRepository.getUserId.mockRejectedValue(undefined);
        const result = await service.getRecent(1);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });
  });

  describe('3. findOrCreateTags 테스트', () => {
    it('SUCCESS: 사용된 태그가 생성되지 않은 태그일 경우 정상 처리한다.', async () => {
      const articleId = 5;
      const tag = [
        {
          tagName: '부산',
          order: 1,
        },
      ];
      const newTagInfo = {
        id: 3,
        tagName: '부산',
      };
      const createTag = { id: 1, tagId: newTagInfo.id, order: 1, articleId };

      tagRepository.findOne.mockReturnValue(undefined);
      tagRepository.create.mockReturnValue(newTagInfo);
      tagRepository.save.mockReturnValue(newTagInfo);
      articleToTagRepository.create.mockReturnValue(createTag);
      articleToTagRepository.save(createTag);

      const result = await service.findOrCreateTags(articleId, tag);

      expect(tagRepository.findOne).toBeCalledTimes(1);
      expect(tagRepository.create).toBeCalledTimes(1);
      expect(tagRepository.save).toBeCalledTimes(1);
      expect(articleToTagRepository.create).toBeCalledTimes(1);
      expect(articleToTagRepository.save).toBeCalledTimes(2);
      expect(result).toStrictEqual([newTagInfo.tagName]);
    });

    it('SUCCESS: 사용된 태그가 이미 생성된 태그일 경우 정상 처리한다.', async () => {
      const tag = [
        {
          tagName: '부산',
          order: 1,
        },
      ];
      const newTagInfo = {
        id: 3,
        tagName: '부산',
      };
      const createTag = { id: 1, tagId: newTagInfo.id, order: 1, articleId };

      tagRepository.findOne.mockReturnValue(newTagInfo);
      articleToTagRepository.create.mockReturnValue(createTag);
      articleToTagRepository.save(createTag);

      const result = await service.findOrCreateTags(articleId, tag);

      expect(tagRepository.findOne).toBeCalledTimes(1);
      // tagRepository create, save는 이미 생성된 경우 생략
      expect(tagRepository.create).toBeCalledTimes(0);
      expect(tagRepository.save).toBeCalledTimes(0);
      expect(articleToTagRepository.create).toBeCalledTimes(1);
      expect(articleToTagRepository.save).toBeCalledTimes(2);
      expect(result).toStrictEqual([newTagInfo.tagName]);
    });

    it('ERROR: 태그 조회 중 비정상 종료 시 Not Found Tags 반환', async () => {
      const tag = [
        {
          tagName: '부산',
          order: 1,
        },
      ];
      const errorMessage = 'not found tags';
      try {
        tagRepository.findOne.mockRejectedValue(undefined);
        const result = await service.findOrCreateTags(articleId, tag);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });
  });

  describe('4. createArticle 테스트', () => {
    it('SUCCESS: 게시물이 정상적으로 생성된다.', async () => {
      const userInfo = { id: 5, nickname: 'test', profileImage: 'profile.jpg' };
      const articleResult = createdArticle.data.articleInfo;
      const trackList = {
        order: 1,
        imageSrc: 'testImage.jpg',
        placeName: '용호동낙지',
        addressName: '부산 용호동',
        x: '153.322',
        y: '43,222',
      };
      const tagNames = ['테스트', '엽기'];
      userRepository.findOne.mockResolvedValue(userInfo);
      articleRepository.createArticle.mockResolvedValue(articleResult);
      trackRepository.createTrack.mockResolvedValue(trackList);
      const findOrCreateTagsSpy = jest.spyOn(service, 'findOrCreateTags');
      findOrCreateTagsSpy.mockResolvedValue(tagNames);
      const result = await service.createArticle(createArticleDto);

      expect(userRepository.findOne).toBeCalledTimes(1);
      expect(articleRepository.createArticle).toBeCalledTimes(1);
      expect(trackRepository.createTrack).toBeCalledTimes(1);
      expect(service.findOrCreateTags).toBeCalledTimes(1);
      expect(result.data).toStrictEqual({
        userInfo,
        articleInfo: {
          ...articleResult,
          roads: trackList,
        },
      });
      expect(result.message).toBe('article created');
    });

    it('ERROR: 유저 정보가 없을 경우 Not Found Exception 반환', async () => {
      const errorMessage = `not found user's information`;
      try {
        userRepository.findOne.mockReturnValue(undefined);
        const result = await service.createArticle(createArticleDto);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 게시물 생성이 비정상적으로 종료될 경우 생성된 게시물 삭제 및 Bad Request Exception 반환', async () => {
      const errorMessage = 'bad request'
      const userInfo = { id: 5, nickname: 'test', profileImage: 'profile.jpg' };
      const articleResult = createdArticle.data.articleInfo;
      try {
        userRepository.findOne.mockResolvedValue(userInfo);
        articleRepository.createArticle.mockResolvedValue(articleResult);
        trackRepository.createTrack.mockRejectedValue(undefined);
        const result = await service.createArticle(createArticleDto);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.response.message).toBe(errorMessage);
        expect(articleRepository.deleteArticle).toBeCalledTimes(1);
        expect(articleRepository.deleteArticle).toBeCalledWith(
          articleResult.id,
        );
      }
    });
  });

  describe('5. getArticleDetail Test', () => {
    beforeEach(async () => {
      const createdTagInfo = {
        tagId: 32,
        tagName: '추가',
        id: 10,
        hits: 0,
        createdAt: "2022-04-18T07:33:54.000Z",
        updatedAt: "2022-04-18T07:33:54.000Z"
      }
      articleRepository.getArticleDetail.mockResolvedValue(articleInfo);
      articleRepository.addArticleHits.mockResolvedValue(true);
      userRepository.getUserInfo.mockResolvedValue(userInfo);
      likesRepository.likeOrNot.mockResolvedValue(likedOrNot);
      articleToTagRepository.getTagIds.mockResolvedValue(tagIds);
      tagRepository.getTagNameWithIds.mockResolvedValue(tagName);
      tagHitsRepository.addTagHits.mockResolvedValue(true);
      tagHitsRepository.createTagHits.mockResolvedValue(createdTagInfo)
      trackRepository.getRoads.mockResolvedValue(roads);
    });
    it('SUCCESS: 해당 게시물의 상세페이지를 정상적으로 조회한다.', async () => {
      articleRepository.addArticleHits.mockResolvedValue(true);
      tagHitsRepository.addTagHits.mockResolvedValue(true);
      const result = await service.getArticleDetail(articleId, userId);
      expect(result.data).toStrictEqual({
        userInfo,
        articleInfo: article,
      });
      expect(result.message).toBe('ok');
    });

    it('SUCCESS: 해당 게시물의 조회수를 1 추가한다.', async () => {
      const result = await service.addArticleHits(articleId);
      expect(result).toStrictEqual(true);
    });

    it('SUCCESS: 해당 게시물의 태그들의 조회수를 1 추가한다.', async () => {
        const result = await service.addTagHits(tagIds[0], tagName);
        expect(result).toStrictEqual(true);
    });

    it('ERROR: 게시물 정보를 찾을 수 없을 경우 Not Found Exception 반환.', async () => {
      const errorMessage = `not found the article's contents`;
      try {
        articleRepository.getArticleDetail.mockResolvedValue(undefined);
        const result = await service.getArticleDetail(articleId, userId);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 게시물에 대한 유저정보를 찾을 수 없을 경우 Not Found Exception 반환.', async () => {
      const errorMessage = `not found user's information`;
      try {
        userRepository.getUserInfo.mockResolvedValue(undefined);
        const result = await service.getArticleDetail(articleId, userId);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 게시물에 대한 태그 정보를 찾을 수 없을 경우 Not Found Exception 반환.', async () => {
      const errorMessage = `not found tags`;
      try {
        articleToTagRepository.getTagIds.mockResolvedValue(undefined);
        const result = await service.getArticleDetail(articleId, userId);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 게시물에 대한 경로 정보를 찾을 수 없을 경우 Not Found Exception 반환.', async () => {
      const errorMessage = `not found article's roads`;
      try {
        trackRepository.getRoads.mockResolvedValue(undefined);
        const result = await service.getArticleDetail(articleId, userId);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });
  });

  describe('6. updateArticle 테스트', () => {
    beforeEach(async () => {
      const roads = createArticleDto.road;
      const articleInfo = {
        userId: 5,
        ...articles,
        content: 'Test 본문입니다.',
        createdAt: '2022/04/01',
      };
      articleRepository.findOne.mockResolvedValue(articleInfo);
      articleRepository.update.mockResolvedValue({
        id: 5,
        content: 'Test 본문입니다.',
      });
      userRepository.findOne.mockResolvedValue(userInfo);
      articleToTagRepository.find.mockReturnValue(lastTags);
      trackRepository.getRoads.mockResolvedValue(roads);
      articleToTagRepository.deleteTags.mockResolvedValue('deleted');
      const findOrCreateTagsSpy = jest.spyOn(service, "findOrCreateTags")
      findOrCreateTagsSpy.mockResolvedValue(["테스트", "엽기"]);
    });

    it('SUCCESS: 게시물 내용이 정상적으로 수정이 된다.', async () => {
      const successMessage = 'article modified';
      const dto = {
        ...updateArticleDto,
        user: 5,
        articleId: 6,
      };
      const result = await service.updateArticle(dto);
      expect(result.data).toEqual({
        userInfo,
        articleInfo: {
          ...articleInfo,
          roads,
        },
      });
      expect(result.message).toBe(successMessage);
    });

    it('ERROR: 게시물 정보가 조회가 불가능 할 경우 Not Found Exception 반환', async () => {
      const errorMessage = `not found article's contents`;
      try {
        articleRepository.findOne.mockResolvedValue(undefined);
        const result = await service.updateArticle(updateArticleDto);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 수정하려는 유저가 게시물을 작성한 유저가 아니라면 Forbidden Exception 반환', async () => {
      const errorMessage = 'permission denied';
      try {
        articleRepository.findOne.mockResolvedValue(articleInfo);
        const result = await service.updateArticle(updateArticleDto);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(403);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 게시물을 작성한 유저 정보를 찾을 수 없을 경우 Not Found Exception 반환', async () => {
      const errorMessage = 'not found user information';
      const dto = {
        ...updateArticleDto,
        user: 5,
        articleId: 6,
      };
      try {
        userRepository.findOne.mockResolvedValue(undefined);
        const result = await service.updateArticle(dto);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 기존 게시물에 대한 태그를 찾을 수 없을 경우 Not Found Exception 반환', async () => {
      const errorMessage = 'not found tags';
      const dto = {
        ...updateArticleDto,
        user: 5,
        articleId: 6,
      };
      try {
        articleToTagRepository.find.mockResolvedValue(undefined);
        const result = await service.updateArticle(dto);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 게시물에 대한 경로 정보를 찾을 수 없을 경우 Not Found Exception 반환', async () => {
      const errorMessage = `not found article's roads`;
      const dto = {
        ...updateArticleDto,
        user: 5,
        articleId: 6,
      };
      try {
        trackRepository.getRoads.mockResolvedValue(undefined);
        const result = await service.updateArticle(dto);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 기존 태그 삭제가 비정상적으로 종료될 경우 기존 작업 취소 및 Bad Request Exception 반환', async () => {
      const errorMessage = 'bad request, a task was cancelled';
      const dto = {
        ...updateArticleDto,
        user: 5,
        articleId: 6,
      };
      try {
        articleToTagRepository.deleteTags.mockResolvedValue(undefined);
        const result = await service.updateArticle(dto);
        expect(result).toBeDefined();
      } catch (err) {
        expect(articleRepository.update).toBeCalledTimes(2);
        expect(articleToTagRepository.deleteTags).toBeCalledTimes(2);
        expect(err.status).toBe(400);
        expect(err.response.message).toBe(errorMessage);
      }
    });

    it('ERROR: 신규 태그 생성 작업이 비정상적으로 종료될 경우 기존 작업 취소 및 Bad Request Exception 반환', async () => {
      const errorMessage = 'bad request, a task was cancelled';
      const dto = {
        ...updateArticleDto,
        user: 5,
        articleId: 6,
      };
      try {
        const findOrCreateTagsSpy = jest.spyOn(service, "findOrCreateTags")
        findOrCreateTagsSpy.mockResolvedValue(undefined);
        const result = await service.updateArticle(dto);
        expect(result).toBeDefined();
      } catch (err) {
        expect(articleRepository.update).toBeCalledTimes(2);
        expect(articleToTagRepository.deleteTags).toBeCalledTimes(2);
        expect(err.status).toBe(400);
        expect(err.response.message).toBe(errorMessage);
      }
    });
  });

  describe('7. deleteArticle 테스트', () => {
    it('SUCCESS: 게시물 삭제가 정상적으로 완료됨', async () => {
      const successMessage = 'article deleted';
      articleRepository.deleteArticle.mockResolvedValue('success');
      const result = await service.deleteArticle(articleId);
      expect(articleRepository.deleteArticle).toBeCalledTimes(1);
      expect(articleRepository.deleteArticle).toBeCalledWith(articleId);
      expect(result.message).toEqual(successMessage);
    });

    it('ERROR: 삭제할 게시물을 찾지 못하면 Not Found Exception 반환', async () => {
      const errorMessage = 'not found article you wanted to delete';
      try {
        const unknownUserId = 105;
        articleRepository.deleteArticle.mockResolvedValue(null);
        const result = await service.deleteArticle(unknownUserId);
        expect(result).toBeDefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe(errorMessage);
      }
    });
  });

  describe('8. getPopularTag 테스트', () => {
    it('SUCCESS: 인기 태그가 정상적으로 조회 됨', async () => {
      const successMessage = 'success';
      const popularTags = [
        {
          tagId: 1,
          tagName: "서울",
          hits: 35
        },
        {
          tagId: 2,
          tagName: "부산",
          hits: 24
        },
        {
          tagId: 3,
          tagName: "해운대",
          hits: 22
        },

      ]
      tagHitsRepository.getPopularTag.mockResolvedValue(popularTags);
      const result = await service.getPopularTag();
      expect(tagHitsRepository.getPopularTag).toBeCalledTimes(1);
      expect(result.data.popularTags).toBe(popularTags);
      expect(result.message).toEqual(successMessage);
    });

    it('ERROR: 인기 태그를 찾지 못하면 실패 메시지 반환', async () => {
      const errorMessage = 'popular tags searching failed';
      tagHitsRepository.getPopularTag.mockResolvedValue(undefined);
      const result = await service.getPopularTag();
      expect(tagHitsRepository.getPopularTag).toBeCalledTimes(1);
      expect(result.data).toBe(null);
      expect(result.message).toEqual(errorMessage);
    });
  });
});