import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { CommentRepository } from 'src/comments/repositories/comments.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersService } from 'src/users/users.service';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { FollowRepository } from './repositories/follow.repository';

describe('FollowController', () => {
  let controller: FollowController;
  let service: FollowService;

  const mockFollowService = {
    followUnfollow: jest.fn(),
    getFollowerList: jest.fn(),
    getFollowingList: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [
        UsersService,
        FollowService,
        UserRepository,
        ArticleRepository,
        ArticleToTagRepository,
        TagRepository,
        FollowRepository,
        LikesRepository,
        CommentRepository
      ],
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })]
    }).overrideProvider(FollowService).useValue(mockFollowService).compile();

    controller = module.get<FollowController>(FollowController);
    service = module.get<FollowService>(FollowService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('followUnFollow 연결 테스트', async () => {
    const followDto = {
      loginMethod: 0,
      user: 1,
      followingUserId: 2
    };

    await controller.followUnFollow(followDto);

    expect(service.followUnfollow).toHaveBeenCalled();
  });

  it('getFollowerList 연결 테스트', async () => {
    const user = 2;
    const page = 1;

    await controller.getFollowerList(user, page);

    expect(service.getFollowerList).toHaveBeenCalled();
  });

  it('getFollowingList 연결 테스트', async () => {
    const user = 2;
    const page = 1;

    await controller.getFollowingList(user, page);

    expect(service.getFollowingList).toHaveBeenCalled();
  });
});
