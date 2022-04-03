import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from 'src/comments/repositories/comments.repository';
import { Follow } from 'src/follow/entities/follow.entity';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { Likes } from 'src/likes/entities/likes.entity';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersService } from 'src/users/users.service';
import { getRepository, Repository } from 'typeorm';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { Article } from './entities/article.entity';
import { ArticleToTag } from './entities/article_tag.entity';
import { Tag } from './entities/tag.entity';
import { Track } from './entities/track.entity';
import { ArticleRepository } from './repositories/article.repository';
import { ArticleToTagRepository } from './repositories/article_tag.repository';
import { TagRepository } from './repositories/tag.repository';
import { TrackRepository } from './repositories/track.repository';

const mockArticleRepository = () => ({
  getArticleInfo: jest.fn(),
  getUserId: jest.fn(),
  createArticle: jest.fn(),
  deleteArticle: jest.fn(),
  getArticleDetail: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn()
});

const mockFollowRepository = () => ({
  getFollowingIds: jest.fn()
});

const mockUserRepository = () => ({
  getFollowingIds: jest.fn(),
  getUsername: jest.fn(),
  getProfileImage: jest.fn(),
  findOne: jest.fn(),
  getUserInfo: jest.fn()
});

const mockArticleToTagRepository = () => ({
  getTagIds: jest.fn(),
  find: jest.fn(),
  getRoads: jest.fn(),
  deleteTags: jest.fn(),
  save: jest.fn()
});

const mockTagRepository = () => ({
  getTagNameWithIds: jest.fn(),
  findOne: jest.fn(),
  createsave: jest.fn()
})

const mockTrackRepository = () => ({
  createTrack: jest.fn(),
  getRoads: jest.fn()
})

const mockLikesRepository = () => ({
  likeOrNot: jest.fn()
})

const userId = 31;
const articleId = 5;
const page = 9;
const articles = 
{          
  id: 5,
  userId: 3,
  thumbnail: "thumbnail.jpg",
  nickname: "테스트용 계정",
  profileImage: "profileImage.jpg",
  totalLike: 5,
  totalComment: 3,
  tags: [
    {
      tagName: "테스트",
      order: 1
    }, 
    { 
      tagName: "엽기",
      order: 2
    }
  ]
};
const tags = [
  {
    tagName: "부산",
    order: 1
  },
  {
    tagName: "붓싼",
    order: 2
  },
  {
    tagName: "광안리",
    order: 3
  },
]
const createArticleDto: CreateArticleDto = {
  user: 5,
  road: [
    {
      order: 1, 
      imgSrc: "busan.jpg", 
      address: "부산 해운대", 
      name: "부산", 
      x: "123.323",
      y: "53.212" 
    }
  ],
  tag: [
    {
      tagName: "테스트",
      order: 1
    },
    {
      tagName: "엽기",
      order: 2
    }
  ],
  content: "본문입니다.",
  thumbnail: "thumbnail.png",
  loginMethod: 1,
}

const userInfo = {
  id: 5,
  nickname: "test",
  profileImage: "testProfile.jpg"
}

const createdArticle = {
  data: {
    userInfo,
    articleInfo: {
      id: articleId,
      totalLike: 0,
      totalComment: 0,
      roads: createArticleDto.road,
      tags: createArticleDto.tag,
      comments: []
    }
  }, 
  message: 'article created'
}

const articleDetail = {
  data: {
    userInfo,
    articleInfo: {
      id: articleId,
      thumbnail: "thumbnail.jpg",
      content: "테스트 본문입니다.",
      totalLike: Math.random()*10,
      totalComment: Math.random()*10,
      likedOrNot: 1,
      createdAt: Date.now(),
      roads: createArticleDto.road,
      tags: createArticleDto.tag,
    }
  }, 
  message: 'ok'
}

const articleModified = {
  data: {
    userInfo,
    articleInfo: {
      id: articleId,
      thumbnail: "thumbnail.jpg",
      content: "테스트 본문입니다.",
      totalLike: Math.random()*10,
      totalComment: Math.random()*10,
      roads: createArticleDto.road,
      tags: createArticleDto.tag,
    }
  }, 
  message: 'article modified'
}

const updateArticleDto: UpdateArticleDto = {
  loginMethod: 1,
  user: 3,
  articleId: 5,
  content: "테스트 본문입니다.",
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('Articles Service', () => {
  let service: ArticlesService;
  let articleRepository: MockRepository<Article>;
  let followRepository: MockRepository<Follow>;
  let userRepository: MockRepository<User>;
  let tagRepository: MockRepository<Tag>;
  let articleToTagRepository: MockRepository<ArticleToTag>
  let trackRepository: MockRepository<Track>;
  let likesRepository: MockRepository<Likes>;

  beforeEach(async () => {
    const module:  TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        ArticlesService,
        ArticleRepository,
        TrackRepository,
        TagRepository,
        ArticleToTagRepository,
        UserRepository,
        FollowRepository,
        CommentRepository,
        LikesRepository,
        UsersService,
        {
          provide: getRepositoryToken(Article), 
          useValue: mockArticleRepository()
        },
        {
          provide: getRepositoryToken(Follow), 
          useValue: mockFollowRepository()
        },
        {
          provide: getRepositoryToken(User), 
          useValue: mockUserRepository()
        },
        {
          provide: getRepositoryToken(ArticleToTag), 
          useValue: mockArticleToTagRepository()
        },
        {
          provide: getRepositoryToken(Tag), 
          useValue: mockTagRepository()
        },
        {
          provide: getRepositoryToken(Track), 
          useValue: mockTrackRepository()
        },
        {
          provide: getRepositoryToken(Likes), 
          useValue: mockLikesRepository()
        },
      ],
      imports: [
        JwtModule.register({ secret: process.env.JWT_SECRET })
      ]
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articleRepository = module.get<MockRepository<Article>>(getRepositoryToken(Article));
    followRepository = module.get(getRepositoryToken(Follow));
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    tagRepository = module.get<MockRepository<Tag>>(getRepositoryToken(Tag));
    articleToTagRepository = module.get<MockRepository<ArticleToTag>>(getRepositoryToken(ArticleToTag));
    trackRepository = module.get<MockRepository<Track>>(getRepositoryToken(Track));
    likesRepository = module.get<MockRepository<Likes>>(getRepositoryToken(Likes));
  });

  describe("메인페이지 조회 기능 TEST", () => {
    it('SUCCESS: 메인페이지가 정상 조회됨', async () => {
      jest.spyOn(service, 'getMain').mockResolvedValue(articles);
      const result = await service.getMain(userId, page);
      expect(result).toStrictEqual(articles);
    })
    it('ERROR: 메인 페이지 비정상 조회 시 서버 오류 반환', async () => {
      jest.spyOn(service, 'getMain').mockRejectedValueOnce(new InternalServerErrorException('err'));
      expect(service.getMain).rejects.toThrowError(new InternalServerErrorException('err'));
    })

    it('ERROR: 팔로잉이 없을 경우 Not Found Exception 반환', () => {
      jest.spyOn(service, 'getMain').mockRejectedValueOnce(new NotFoundException());
      expect(service.getMain).rejects.toThrowError(new NotFoundException());
    })

    it('ERROR: 게시물이 없을 경우 Not Found Exception 반환', () => {
      jest.spyOn(service, 'getMain').mockRejectedValueOnce(new NotFoundException());
      expect(service.getMain).rejects.toThrowError(new NotFoundException());
    })
  })

  describe('메인페이지 최신순 조회 기능 TEST', () => {
    it('SUCCESS: 메인페이지가 최신순으로 정상 조회됨', async () => {
      jest.spyOn(service, 'getRecent').mockResolvedValue(articles);
      const result = await service.getRecent(page);
      expect(result).toStrictEqual(articles);
    })

    it('ERROR: 게시물이 없을 경우 Not Found Exception 반환', async () => {
      jest.spyOn(service, 'getRecent').mockRejectedValueOnce(new NotFoundException('cannot find articles'));
      expect(service.getRecent).rejects.toThrowError(new NotFoundException('cannot find articles'));
    })

    it('ERROR: 메인 페이지 비정상 조회 시 서버 오류 반환', async () => {
      jest.spyOn(service, 'getRecent').mockRejectedValueOnce(new InternalServerErrorException('err'));
      expect(service.getRecent).rejects.toThrowError(new InternalServerErrorException('err'));
    })
    
  })

  describe('태그 조회 및 생성 TEST', () => {
    it('SUCCESS: 저장할 태그의 존재 여부를 조회한다.', async () => {
      const tagNames = tags.map((tag) => tag.tagName);
      jest.spyOn(service, 'findOrCreateTags').mockResolvedValueOnce(tagNames);
      const result = await service.findOrCreateTags(userId, articleId, tags);
      expect(result).toStrictEqual(tagNames);
    })

    it('SUCCESS: 태그가 기존 테이블에 존재하지 않을 경우 테이블에 신규 저장한다.', async () => {
      const newTags = [
        {
          tagId: 1,
          tagName: "테스트"
        },
        {
          tagId: 2,
          tagName: "엽기"
        },
      ]
      jest.spyOn(articleToTagRepository, 'save').mockResolvedValueOnce(newTags.map(tag => tag.tagName));
      // articleToTagRepository.save = jest.fn();
      const result = await articleToTagRepository.save(newTags);
      expect(result).toEqual(newTags.map(tag => tag.tagName));
    })

    it('ERROR: 태그 비정상 조회 시 서버 오류 반환', async () => {
      jest.spyOn(service, 'findOrCreateTags').mockRejectedValue((new InternalServerErrorException('err')));
      expect(service.findOrCreateTags).rejects.toThrowError(new InternalServerErrorException('err'));
    })
  })

  describe('게시물 생성 TEST', () => {
    
    it('SUCCESS: 유저 정보를 조회한다.', async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(userInfo)
      const result = await userRepository.findOne(userId);
      expect(result).toEqual(userInfo);
    })

    it('SUCCESS: 게시물이 정상적으로 생성됨', async () => {
      jest.spyOn(service, "createArticle").mockResolvedValue(createdArticle)
      const result =  await service.createArticle(createArticleDto);
      
      expect(result).toEqual(createdArticle);
      expect(result.data.userInfo).toBeDefined();
      expect(result.data.articleInfo).toBeDefined();
      expect(result.message).toBe('article created');
    })

    it('ERROR: 유저 정보가 없을 경우 Not Found Exception 반환', async () => {
      const userId = 3;
      jest.spyOn(userRepository, "findOne").mockRejectedValue(new NotFoundException('cannot find user'));
      expect(userRepository.findOne).rejects.toThrowError(new NotFoundException('cannot find user'));
    })
    

    it('ERROR: 게시물 생성이 비정상적일 경우 Bad Request Exception 반환', async () => {
      jest.spyOn(service, "createArticle").mockRejectedValue(new BadRequestException('bad request'));
      expect(service.createArticle).rejects.toThrowError(new BadRequestException('bad request'));
    })

    it('ERROR: 게시물 생성이 비정상적으로 종료될 경우 생성된 article 삭제', async () => {
      const deleteMessage = {message: 'article deleted'};

      jest.spyOn(service, "createArticle").mockRejectedValue(new BadRequestException('bad request'));
      jest.spyOn(service, "deleteArticle").mockResolvedValue(deleteMessage);
      const result = await service.deleteArticle(articleId);
      expect(service.createArticle).rejects.toThrowError(new BadRequestException('bad request'));
      expect(service.deleteArticle).toBeCalledTimes(1);
      expect(result).toEqual(deleteMessage);
    })

    
  })

  describe('게시물 상세페이지 조회 TEST', () => {
    it('SUCCESS: 해당 게시물의 상세페이지를 정상적으로 조회한다.', async () => {
      jest.spyOn(service, "getArticleDetail").mockResolvedValue(articleDetail)
      const result = await service.getArticleDetail(articleId, userId);
      expect(result).toEqual(articleDetail)
    })

    it('ERROR: 게시물 상세페이지 비정상 조회 시 서버 오류를 반환한다.', async () => {
      jest.spyOn(service, "getArticleDetail").mockRejectedValue(new InternalServerErrorException('err'))
      expect(service.getArticleDetail).rejects.toThrowError(new InternalServerErrorException('err'));
    })
  })

  describe('게시물 수정 TEST', () => {
    it('SUCCESS: 삭제하려고 하는 게시물이 정상적으로 조회가 된다.', async () => {
      const articleInfo = {
        id: 5, 
        content: "test 본문입니다.", 
        totalComment: 5, 
        totalLike: 3, 
        userId: 2
      }
      jest.spyOn(articleRepository, "findOne").mockResolvedValue(articleInfo);
      const result = await articleRepository.findOne(articleId);
      expect(result).toEqual(articleInfo);
    })

    it('SUCCESS: 게시물 내용이 정상적으로 수정이 된다.', async () => {
      jest.spyOn(service, "updateArticle").mockResolvedValue(articleModified);
      const result = await service.updateArticle(updateArticleDto)
      expect(result).toEqual(articleModified);
    })

    it('ERROR: 게시물 정보가 조회가 불가능 할 경우 Not Found Exception 반환', async () => {
      jest.spyOn(service, "updateArticle").mockRejectedValue(new NotFoundException('cannot find article'))
      expect(service.updateArticle).rejects.toThrowError(new NotFoundException('cannot find article'));
    })

    it('ERROR: 수정하려는 유저가 게시물을 작성한 유저가 아니라면 Forbidden Exception 반환', async () => {
      jest.spyOn(service, "updateArticle").mockRejectedValue(new ForbiddenException('permission denied'))
      expect(service.updateArticle).rejects.toThrowError(new ForbiddenException('permission denied'));
    })

    it('ERROR: 게시물 수정이 비정상적일 경우 Bad Request Exception 반환', async () => {
      jest.spyOn(service, "updateArticle").mockRejectedValue(new BadRequestException('bad request'))
      expect(service.updateArticle).rejects.toThrowError(new BadRequestException('bad request'));
    })
  })

  describe('게시물 삭제 TEST', () => {
    it('SUCCESS: 게시물 삭제가 정상적으로 완료됨', async () => {
      const successMessage = {message: 'article deleted'};
      jest.spyOn(service, "deleteArticle").mockResolvedValue(successMessage)
      const result = await service.deleteArticle(articleId);
      expect(result).toEqual(successMessage)
    })

    it('ERROR: 삭제할 게시물을 찾지 못하면 Not Found Exception 반환', async () => {
      jest.spyOn(service, "deleteArticle").mockRejectedValue(new NotFoundException('Not Found Article you wanted to delete'));
      expect(service.deleteArticle).rejects.toThrowError(new NotFoundException('Not Found Article you wanted to delete'));
    })
  })
})
