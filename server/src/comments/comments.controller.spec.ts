import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersService } from 'src/users/users.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentRepository } from './repositories/comments.repository';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    getComments: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        UsersService,
        CommentsService,
        UserRepository,
        ArticleRepository,
        ArticleToTagRepository,
        TagRepository,
        FollowRepository,
        LikesRepository,
        CommentRepository
      ],
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })]
    }).overrideProvider(CommentsService).useValue(mockCommentsService).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('1. createComment 연결 테스트', async () => {
    const createCommentDto = {
      loginMethod: 0,
      user: 1,
      articleId: 2,
      comment: 'comment created'
    }

    await controller.createComment(createCommentDto);

    expect(service.createComment).toBeCalledTimes(1);
  })

  it('2. deleteComment 연결 테스트', async () => {
    const commentId = 1;
    const articleId = 2;

    await controller.deleteComment(commentId, articleId);

    expect(service.deleteComment).toBeCalledTimes(1);
  })

  it('3. getComments 연결 테스트', async () => {
    const id = 1;
    const page = 1;

    await controller.getComments(id, page);

    expect(service.getComments).toBeCalledTimes(1);
  })
});
