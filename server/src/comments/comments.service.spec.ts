import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comments.dto';
import { Comments } from './entities/comments.entity';
import { CommentRepository } from './repositories/comments.repository';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentRepository: MockRepository<Comments>;
  let articleRepository: MockRepository<Article>;
  let userRepository: MockRepository<User>;

  type MockRepository<T = any> = Partial<Record<any, jest.Mock>>;

  const mockCommentRepository = () => ({
    createComment: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    getComments: jest.fn()
  });

  const mockArticleRepository = () => ({
    commentIncrement: jest.fn(),
    increment: jest.fn(),
    commentDecrement: jest.fn(),
    decrement: jest.fn(),
    findOne: jest.fn()
  });

  const mockUserRepository = () => ({
    getUserInfo: jest.fn(),
    getCommentWriterInfo: jest.fn(),
    findOne: jest.fn()
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository()
        },
        {
          provide: getRepositoryToken(ArticleRepository),
          useValue: mockArticleRepository()
        },
        { 
          provide: getRepositoryToken(CommentRepository),
          useValue: mockCommentRepository()
        }
      ]
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentRepository = module.get(getRepositoryToken(CommentRepository));
    articleRepository = module.get(getRepositoryToken(ArticleRepository));
    userRepository = module.get(getRepositoryToken(UserRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('1. createComment 테스트', () => {
    beforeEach(() => {
      commentRepository.createComment.mockResolvedValue({
        id: 2,
        comment: "createComment Test"
      });

      userRepository.getCommentWriterInfo.mockResolvedValue(
        {
          id: 3,
          nickname: 'parkcoding',
          profileImage: 'profileImage'
        }
      );

      articleRepository.commentIncrement.mockResolvedValue(1);
    });

    afterEach(() => {
      userRepository.getCommentWriterInfo.mockResolvedValue(
        {
          id: 3,
          nickname: 'parkcoding',
          profileImage: 'profileImage'
        }
      );

      articleRepository.commentIncrement.mockResolvedValue(1);
    });

    it('SUCCESS: 새로운 댓글 작성에 의한 올바른 응답 반환', async () => {
      const loginMethod = 0;
      const user = 3;
      const articleId = 2;
      const comment = "createComment Test";
      const createCommentDto: CreateCommentDto = {
        loginMethod, user, articleId, comment
      };

      const expectedResult = {
        data: {
          commentInfo: {
            id: 2,
            comment: 'createComment Test'
          },
          totalComments: 1,
          writerInfo: {
            id: 3,
            nickname: 'parkcoding',
            profileImage: 'profileImage'
          }
        },
        message: 'comment created'
      };

      const result = await service.createComment(createCommentDto);

      expect(commentRepository.createComment).toHaveBeenCalled();
      expect(articleRepository.commentIncrement).toHaveBeenCalled();
      expect(userRepository.getCommentWriterInfo).toHaveBeenCalled();
      expect(result.data.commentInfo).toEqual(expectedResult.data.commentInfo);
      expect(result.data.totalComments).toEqual(expectedResult.data.totalComments);
      expect(result.data.writerInfo).toEqual(expectedResult.data.writerInfo);
      expect(result.message).toEqual(expectedResult.message);
    })

    it('ERROR: 존재하지 않는 게시물에 대한 댓글 작성 에러 반환', async () => {
      const loginMethod = 0;
      const user = 3;
      const articleId = 3;
      const comment = "createComment Test2";
      const createCommentDto: CreateCommentDto = {
        loginMethod, user, articleId, comment
      };

      articleRepository.commentIncrement = jest.fn(() => undefined);

      try {
        await service.createComment(createCommentDto);
      } catch (err) {
        expect(commentRepository.createComment).toHaveBeenCalled();
        expect(articleRepository.commentIncrement).toHaveBeenCalled();
        expect(userRepository.getCommentWriterInfo).toHaveBeenCalled();
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.status).toBe(404);
        expect(err.response.message).toEqual('the article does not exist');
      }
    })

    it('ERROR: 존재하지 않는 작성자(댓글)에 대한 댓글 작성 에러 반환', async () => {
      const loginMethod = 0;
      const user = 4;
      const articleId = 2;
      const comment = "createComment Test3";
      const createCommentDto: CreateCommentDto = {
        loginMethod, user, articleId, comment
      };

      userRepository.getCommentWriterInfo = jest.fn(() => undefined);

      try {
        await service.createComment(createCommentDto);
      } catch (err) {
        expect(commentRepository.createComment).toHaveBeenCalled();
        expect(articleRepository.commentIncrement).toHaveBeenCalled();
        expect(userRepository.getCommentWriterInfo).toHaveBeenCalled();
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.status).toBe(404);
        expect(err.response.message).toEqual('the writer does not exist');
      }
    })
  });

  describe('2. deleteComment 테스트', () => {
    beforeEach(() => {
      commentRepository.delete.mockResolvedValue({
        affected: 1,
        raw: []
      });

      articleRepository.commentDecrement.mockResolvedValue(0);
    });

    afterEach(() => {
      commentRepository.delete.mockResolvedValue({
        affected: 1,
        raw: []
      });

      articleRepository.commentDecrement.mockResolvedValue(0);
    })

    it('SUCCESS: comment id에 해당하는 댓글 삭제 처리 응답 반환', async () => {
      const commentId = 1;
      const articleId = 2;

      const expectedResult = {
        data: {
          totalComments: 0
        },
        message: 'comment deleted'
      };

      const result = await service.deleteComment(commentId, articleId);

      expect(commentRepository.delete).toHaveBeenCalled();
      expect(articleRepository.commentDecrement).toHaveBeenCalled();
      expect(result.data.totalComments).toEqual(expectedResult.data.totalComments);
      expect(result.message).toEqual(expectedResult.message);
    });

    it('ERROR: 삭제하고자 하는 댓글의 게시물이 존재하지 않을 경우 에러 반환', async () => {
      const commentId = 5;
      const articleId = 2;

      articleRepository.commentDecrement.mockResolvedValue(undefined);

      try {
        await service.deleteComment(commentId, articleId);
      } catch (err) {
        expect(commentRepository.delete).toHaveBeenCalled();
        expect(articleRepository.commentDecrement).toHaveBeenCalled();
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.status).toEqual(404);
        expect(err.response.message).toEqual('the article does not exist');
      }
    });

    it('ERROR: 삭제하고자 하는 댓글이 존재하지 않을 경우 에러 반환', async () => {
      const commentId = 1;
      const articleId = 6;

      commentRepository.delete.mockResolvedValue({
        affected: 0,
        raw: []
      });

      try {
        await service.deleteComment(commentId, articleId);
      } catch (err) {
        expect(commentRepository.delete).toHaveBeenCalled();
        expect(articleRepository.commentDecrement).toHaveBeenCalled();
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.status).toEqual(404);
        expect(err.response.message).toEqual('the commment did not exist');
      }
    });
  });

  describe('3. getComments 테스트', () => {
    beforeEach(() => {
      commentRepository.getComments.mockResolvedValue([
        {
          id: 1,
          comment: 'dummy comment 1',
          articleId: 1,
          userId: 2
        },
        {
          id: 2,
          comment: 'dummy comment 2',
          articleId: 1,
          userId: 1
        },
        {
          id: 3,
          comment: 'dummy comment 3',
          articleId: 1,
          userId: 1
        }
      ]);

      userRepository.getUserInfo.mockResolvedValue([
        {
          id: 2,
          nickname: 'parkhacker',
          profileImage: 'profileImage'
        },
        {
          id: 1,
          nickname: 'kimcoding',
          profileImage: 'profileImage'
        }
      ]);
    });

    it('SUCCESS: 게시물에 해당하는 모든 댓글 조회 응답 반환', async () => {
      const articleId = 1;
      const page = 1;

      const expectedResult = {
        data: [
          {
            id: 1,
            userId: 2,
            profileImage: 'profileImage',
            nickname: 'parkhacker',
            comment: 'dummy comment 1'
          },
          {
            id: 2,
            userId: 1,
            profileImage: 'profileImage',
            nickname: 'kimcoding',
            comment: 'dummy comment 2'
          },
          {
            id: 3,
            userId: 1,
            profileImage: 'profileImage',
            nickname: 'kimcoding',
            comment: 'dummy comment 3'
          },
        ],
        message: `all comments of article Id: ${articleId}`
      }

      const result = await service.getComments(articleId, page);
      
      expect(commentRepository.getComments).toHaveBeenCalled();
      expect(userRepository.getUserInfo).toHaveBeenCalled();
      // expect(result.data).toEqual(expectedResult.data);
      expect(result.message).toEqual(expectedResult.message);
    });

    it('ERROR: 0 이하의 정수로 page 쿼리를 요청받았을 경우 에러 반환', async () => {
      const articleId = 1;
      const page = 0;

      try {
        await service.getComments(articleId, page);
      } catch (err) {
        expect(userRepository.getUserInfo).toBeCalledTimes(0);
        expect(err).toBeInstanceOf(NotAcceptableException);
        expect(err.status).toEqual(406);
        expect(err.response.message).toEqual('unavailable page query');
      }
    });

    it('ERROR: 게시물에 해당하는 모든 댓글 중 한 번에 10개 이상 조회됐을 경우 에러 반환', async () => {
      const articleId = 1;
      const page = 1;

      commentRepository.getComments.mockResolvedValue([
        {
          id: 1,
          comment: 'dummy comment 1',
            articleId: 1,
            userId: 3
        },
        {
          id: 2,
          comment: 'dummy comment 2',
          articleId: 1,
          userId: 1
        },
        {
          id: 3,
          comment: 'dummy comment 3',
          articleId: 1,
          userId: 4
        },
        {
          id: 4,
          comment: 'dummy comment 4',
          articleId: 1,
            userId: 2
          },
          {
          id: 5,
          comment: 'dummy comment 5',
          articleId: 1,
          userId: 2
        },
          {
          id: 6,
          comment: 'dummy comment 6',
          articleId: 1,
          userId: 4
        },
        {
          id: 7,
          comment: 'dummy comment 7',
          articleId: 1,
          userId: 3
        },
        {
          id: 8,
          comment: 'dummy comment 8',
          articleId: 1,
          userId: 1
        },
        {
          id: 9,
          comment: 'dummy comment 9',
          articleId: 1,
          userId: 3
        },
        {
          id: 10,
          comment: 'dummy comment 10',
          articleId: 1,
          userId: 5
        },
        {
          id: 11,
          comment: 'dummy comment 11',
          articleId: 1,
          userId: 8
        },
        {
          id: 12,
          comment: 'dummy comment 13',
          articleId: 1,
          userId: 7
        }
      ]);

      try {
        await service.getComments(articleId, page);
      } catch (err) {
        expect(commentRepository.getComments).toHaveBeenCalled();
        expect(userRepository.getUserInfo).toBeCalledTimes(0);
        expect(err).toBeInstanceOf(NotAcceptableException);
        expect(err.status).toEqual(406);
        expect(err.response.message).toEqual('got more than 10 comments');
      }
    });
  });
});
