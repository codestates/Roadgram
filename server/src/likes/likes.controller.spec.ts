import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { CommentRepository } from 'src/comments/repositories/comments.repository';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersService } from 'src/users/users.service';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { LikesRepository } from './repositories/likes.repository';

describe('LikeController', () => {
  let controller: LikesController;
  let service: LikesService;

  const mockLikesService = {
    likeUnlike: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        LikesService,
        UsersService,
        UserRepository,
        ArticleRepository,
        ArticleToTagRepository,
        TagRepository,
        FollowRepository,
        LikesRepository,
        CommentRepository
      ],
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })]
    }).overrideProvider(LikesService).useValue(mockLikesService).compile();

    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('likeUnlike 연결 테스트', async () => {
    const likesDto = {
      loginMethod: 0,
      user: 1,
      articleId: 2
    };

    await controller.likeUnlike(likesDto);

    expect(service.likeUnlike).toHaveBeenCalled();
  });
});
