import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentRepository } from 'src/comments/repositories/comments.repository';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersService } from 'src/users/users.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticleRepository } from './repositories/article.repository';
import { ArticleToTagRepository } from './repositories/article_tag.repository';
import { TagRepository } from './repositories/tag.repository';
import { TrackRepository } from './repositories/track.repository';

const mockArticlesService = () => ({
  getMain: jest.fn(),
  getRecent: jest.fn(),
  findOrCreateTags: jest.fn(),
  createArticle: jest.fn(),
  getArticleDetail: jest.fn(),
  deleteArticle: jest.fn(),
  updateArticle: jest.fn(),
})

describe('Articles Controller', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          provide: ArticlesService,
          useValue: mockArticlesService()
        }
      ],
      imports: [
        JwtModule.register({ secret: process.env.JWT_SECRET })
      ]
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  it('1. controller.getMain 연결 테스트', async () => {
    const user = 3;
    const page = 1;
    controller.getMain(user, page);
    expect(service.getMain).toBeDefined();
    expect(service.getMain).toBeCalledTimes(1);
  });

  it('2. controller.getRecent 테스트', async () => {
    const page = 1;
    controller.getRecent(page);
    expect(service.getRecent).toBeDefined();
    expect(service.getRecent).toBeCalledTimes(1);
  });

  it('3. controller.getDetail 테스트', async () => {
    const id = 5;
    controller.getDetail(id);
    expect(service.getArticleDetail).toBeDefined();
    expect(service.getArticleDetail).toBeCalledTimes(1);
  });

  it('4. controller.createArticle 테스트', async () => {
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
    controller.createArticle(createArticleDto);
    expect(service.createArticle).toBeDefined();
    expect(service.createArticle).toBeCalledTimes(1);
  });

  it('5. controller.updateArticle 테스트', async () => {
    const updateArticleDto: UpdateArticleDto = {
      loginMethod: 1,
      user: 3,
      articleId: 5,
      content: "테스트 본문입니다.",
    };
    controller.updateArticle(updateArticleDto);
    expect(service.updateArticle).toBeDefined();
    expect(service.updateArticle).toBeCalledTimes(1);
  });

  it('6. controller.deleteArticle 테스트', async () => {
    const id = 2;
    controller.deleteArticle(id);
    expect(service.deleteArticle).toBeDefined();
    expect(service.deleteArticle).toBeCalledTimes(1);
  });
});