import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticleRepository } from 'src/articles/repositories/article.repository';
import { ArticleToTagRepository } from 'src/articles/repositories/article_tag.repository';
import { TagRepository } from 'src/articles/repositories/tag.repository';
import { CommentRepository } from 'src/comments/repositories/comments.repository';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { UserRepository } from './repositories/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUserRepository = () => ({
  putRefreshToken: jest.fn(),
  findOne: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  update: jest.fn(),
  deleteRefreshToken: jest.fn(),
  getUserInfo: jest.fn()
})
const mockFollowRepository = {
  getFollowedIds: jest.fn(),
  getFollowingIds: jest.fn(),
  followedOrNot: jest.fn()
}
const mockCommentRepository = {
  getCommentsByUserId: jest.fn(),
}
const mockLikeRepository = {
  articleIdsByUserId: jest.fn()
}
const mockArticleRepository = {
  findOne: jest.fn(),
  update: jest.fn(),
  getArticleInfo: jest.fn()
}

const mockArticleToTagRepository = {
  getTagIds: jest.fn()
}

const mockTagRepository = {
  getTagNameWithIds: jest.fn()
}

const mockJwtService = () => ({
  verifyAsync: jest.fn(),
  sign: jest.fn()
})

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>
type MockService<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<UserRepository>;
  let articleRepository: MockRepository<ArticleRepository>;
  let likesRepository: MockRepository<LikesRepository>;
  let followRepository: MockRepository<FollowRepository>;
  let commentsRepository: MockRepository<CommentRepository>;
  let articleToTagRepository: MockRepository<ArticleToTagRepository>;
  let tagRepository: MockRepository<TagRepository>;
  let jwtService: MockService<JwtService>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getRepositoryToken(UserRepository), useValue: mockUserRepository() },
        { provide: getRepositoryToken(ArticleRepository), useValue: mockArticleRepository },
        { provide: getRepositoryToken(ArticleToTagRepository), useValue: mockArticleToTagRepository },
        { provide: getRepositoryToken(TagRepository), useValue: mockTagRepository },
        { provide: getRepositoryToken(FollowRepository), useValue: mockFollowRepository },
        { provide: getRepositoryToken(LikesRepository), useValue: mockLikeRepository },
        { provide: getRepositoryToken(CommentRepository), useValue: mockCommentRepository },
        { provide: JwtService, useValue: mockJwtService() }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(UserRepository));
    articleRepository = module.get(getRepositoryToken(ArticleRepository));
    likesRepository = module.get(getRepositoryToken(LikesRepository));
    followRepository = module.get(getRepositoryToken(FollowRepository));
    commentsRepository = module.get(getRepositoryToken(CommentRepository));
    articleToTagRepository = module.get(getRepositoryToken(ArticleToTagRepository));
    tagRepository = module.get(getRepositoryToken(TagRepository));
    jwtService = module.get(JwtService);
  });

  describe('1. service.login ?????????', () => {
    beforeEach(() => {
      userRepository.findOne.mockResolvedValue({
        email: 'kimcoding@gmail.com',
        password: '$2b$10$BrgDGgx5SaIsFAVX7JlYEuCiBSjSPSKS9C6.GDhBuVfLgogD08UIi',
        nickname: 'kimcoding',
        profileImage: 'profileImage',
        loginMethod: 0,
        id: 1
      });
      jwtService.sign.mockReturnValueOnce('accessToken');
      jwtService.sign.mockReturnValueOnce('refreshToken');
    })
    it('SUCCESS: ?????? ???????????? ???????????? ?????????', async () => {
      const response = await service.login({ email: 'kimcoding@gmail.com', password: '12341234' });
      const example = {
        nickname: 'kimcoding',
        profileImage: 'profileImage',
        loginMethod: 0,
        id: 1
      }
      expect(userRepository.findOne).toBeCalledTimes(1);
      expect(userRepository.putRefreshToken).toBeCalledTimes(1);
      expect(response.message).toBe('login ok');
      expect(response.data.accessToken).toBe('accessToken');
      expect(response.data.refreshToken).toBe('refreshToken');
      expect(response.data.userInfo).toEqual(example)
    })
    it('ERROR: ?????? ???????????? ???????????? 404??????', async () => {
      try {
        const response = await service.login({ email: '', password: '' });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe('login fail');
        expect(userRepository.findOne).toBeCalledTimes(1);
      }
    })
  })

  describe('2. service.logout ?????????', () => {
    it('SUCCESS: deleteRefreshToken??? ????????????????????????.', () => {
      service.logout({ user: 1, loginMethod: 0 });
      expect(userRepository.deleteRefreshToken).toBeCalledTimes(1);
    })
  })

  describe('3. service.signup ?????????', () => {
    it('SUCCESS: ??????????????? ??????????????????.', async () => {
      const response = await service.signup({ email: '', password: '', nickname: '' });
      expect(response).toEqual({ message: 'signup succeed' });
      expect(userRepository.createUser).toBeCalledTimes(1);
    })
  })

  describe('4. service.checkEmail ?????????', () => {
    beforeEach(() => {
      userRepository.findOne.mockResolvedValue({ email: 'kimcoding@gmail.com' });
    })

    it('SUCCESS: ?????? ???????????? ?????? ????????????????????? ????????? ???????????????.', async () => {
      const response = await service.checkEmail({ email: '' });
      expect(response).toEqual({ message: 'available' });
      expect(userRepository.findOne).toBeCalledTimes(1);
    })

    it('ERROR: ???????????? ???????????? ????????? 409??????', async () => {
      try {
        const response = await service.checkEmail({ email: 'kimcoding@gmail.com' });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(409);
        expect(err.response.message).toBe('not available')
        expect(userRepository.findOne).toBeCalledTimes(1);
      }
    })
  })

  describe('5. service.checkNickname ?????????', () => {
    beforeEach(() => {
      userRepository.findOne.mockResolvedValue({ nickname: 'kimcoding' });
    })
    it('SUCCESS: ?????? ????????? ?????? ????????????????????? ????????? ???????????????.', async () => {
      const response = await service.checkNickname({ nickname: 'parkhacker' });
      expect(response).toEqual({ message: 'available' });
      expect(userRepository.findOne).toBeCalledTimes(1);
    })
    it('ERROR: ???????????? ???????????? ????????? 409??????', async () => {
      try {
        const response = await service.checkNickname({ nickname: 'kimcoding' });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(409);
        expect(err.response.message).toBe('not available');
        expect(userRepository.findOne).toBeCalledTimes(1);
      }
    })
  })

  describe('6. service.getTokenKakao ?????????', () => {
    it('ERROR: ????????? ????????? ????????? 401??????', async () => {
      try {
        const response = await service.getTokenKakao({ code: '' });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(401);
        expect(err.response.message).toBe('permission denied');
      }
    })
  })

  describe('7. modifyUser ?????????', () => {
    beforeEach(() => {
      userRepository.updateUser.mockResolvedValue({
        statusMessage: 'Hi there',
        profileImage: 'profileImage',
        nickname: 'kimcoding'
      })
    })
    it('ERROR: ?????? ????????? ????????? ??????????????? ????????? ??? ????????????.', async () => {
      try {
        const response = await service.modifyUser({ loginMethod: 1, user: 1, password: '123123' });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.response.message).toBe('social login user cannot change password');
      }
    })
    it('SUCCESS: ???????????? ?????? ?????? ??? ????????? ???????????????', async () => {
      const response = await service.modifyUser({ loginMethod: 0, user: 1 });
      expect(response).toEqual({
        data: {
          userInfo: {
            statusMessage: 'Hi there',
            profileImage: 'profileImage',
            nickname: 'kimcoding'
          }
        },
        message: 'change succeed'
      }

      )
    })
  })

  describe('8. service.deleteUser ?????????', () => {
    beforeEach(() => {
      likesRepository.articleIdsByUserId.mockResolvedValue([1, 2, 3]);
      followRepository.getFollowedIds.mockResolvedValue([1, 2, 3]);
      followRepository.getFollowingIds.mockResolvedValue([1, 2, 3]);
      commentsRepository.getCommentsByUserId.mockResolvedValue([1, 2, 3]);

      userRepository.findOne.mockResolvedValue({ totalFollower: 1, totalFollowing: 1 });

      articleRepository.findOne.mockResolvedValue({ totalComment: 1, totalLike: 1 });

    })
    it('SUCCESS: ?????? ?????? ??? ?????? ???????????? ??????????????? ?????????.', async () => {
      const response = await service.deleteUser({ loginMethod: 1, user: 1 });

      expect(userRepository.deleteUser).toBeCalledTimes(1);

      expect(followRepository.getFollowedIds).toBeCalledTimes(1);
      expect(followRepository.getFollowingIds).toBeCalledTimes(1);
      expect(likesRepository.articleIdsByUserId).toBeCalledTimes(1);
      expect(commentsRepository.getCommentsByUserId).toBeCalledTimes(1);

      expect(userRepository.findOne).toBeCalledTimes(6);
      expect(userRepository.update).toBeCalledTimes(6);
      expect(articleRepository.findOne).toBeCalledTimes(6);
      expect(articleRepository.update).toBeCalledTimes(6);

      expect(response).toEqual({ message: 'withdrawal succeed' });
    })
  })

  describe('9. service.validateToken ?????????', () => {
    beforeEach(() => {
      jwtService.verifyAsync.mockResolvedValue({ email: 'parkhacker@gmail.com' });
      userRepository.findOne.mockResolvedValue({ email: 'kimcoding@gmail.com', loginMethod: 0 });
    })
    it('ERROR: ?????? ???????????? ?????? ??? ?????? ?????? 404??????', async () => {
      try {
        userRepository.findOne.mockResolvedValueOnce(undefined);
        const response = await service.validateToken({ id: 1, loginMethod: 0 });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe('cannot find user')
      }
    })
    it('ERROR: ???????????? ?????? ????????? ???????????? ??? 401??????', async () => {
      jwtService.verifyAsync.mockRejectedValueOnce(undefined);
      try {
        const response = await service.validateToken({ id: 1, loginMethod: 1 })
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(401);
        expect(err.response.message).toBe('request new access token')
      }
    })
    it('ERROR: ?????? ????????? ????????? ????????? ?????? false??? ??????', async () => {
      const response = await service.validateToken({ id: 1, loginMethod: 0 });
      expect(response).toBe(false);
    })
    it('SUCCESS: ?????? ??? true ??????', async () => {
      userRepository.findOne.mockResolvedValueOnce({ email: 'parkhacker@gmail.com', loginMethod: 0 });
      const response = await service.validateToken({ id: 1, loginMethod: 0 });
      expect(response).toBe(true);
    })
    it('ERROR: ????????? ????????? ??? ???????????? ?????? ?????? ?????? ??? 401??????', async () => {
      try {
        const response = await service.validateToken({ id: 1, loginMethod: 1, accessToken: '' });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(401);
        expect(err.response.message).toBe('request new access token')
      }
    })
  })

  describe('10. service.resfreshAccessToken ?????????', () => {
    beforeEach(() => {
      userRepository.findOne.mockResolvedValue({ id: 1, email: 'kimcoding@gmail.com', refreshToken: 'refreshToken' });
      jwtService.sign.mockReturnValue('newAccessToken');
      jwtService.verifyAsync.mockResolvedValue({ email: 'kimcoding@gmail.com' });
    })
    it('ERROR: ???????????? ?????? ????????? ?????? ????????? 404??????', async () => {
      userRepository.findOne.mockResolvedValueOnce(undefined);
      try {
        const response = await service.refreshAccessToken({ id: 1, loginMethod: 0 });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe('cannot find user');
      }
    })
    it('ERROR: ????????????????????? ????????? ????????? ????????? 403??????', async () => {
      try {
        const response = await service.refreshAccessToken({ id: 1, loginMethod: 0, refreshToken: 'invalidToken' });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(403);
        expect(err.response.message).toBe('invalid token');
      }
    })
    it('ERROR: ????????? ??????????????? ??? ????????????????????? ?????????????????? ?????? ?????? ??? 401??????', async () => {
      jwtService.verifyAsync.mockRejectedValueOnce(undefined);
      try {
        const response = await service.refreshAccessToken({ id: 1, loginMethod: 0, refreshToken: 'refreshToken' });
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(401);
        expect(err.response.message).toBe('refresh token expired');
        expect(userRepository.deleteRefreshToken).toBeCalledTimes(1);
      }
    })
    it('SUCCESS: ?????? ??? ????????? access token??? ??????', async () => {
      const response = await service.refreshAccessToken({ id: 1, loginMethod: 0, refreshToken: 'refreshToken' });
      expect(response).toEqual({
        data: { accessToken: 'newAccessToken' },
        message: 'new access token'
      })
    })
  })

  describe('11. service.getMypage ?????????', () => {
    beforeEach(() => {
      userRepository.getUserInfo.mockResolvedValue({
        nickname: 'kimcoding',
        profileImage: 'profileImage',
        email: 'kimcoding@gmail.com',
        statusMessage: 'im testing',
        totalFollower: 123,
        totalFollowing: 456,
        id: 1
      });
      followRepository.followedOrNot.mockReturnValue(true);
      articleRepository.getArticleInfo.mockResolvedValue([
        {
          id: 1,
          userId: 1,
          thumbnail: 'thumbnail',
          totalLike: 123,
          totalComment: 456
        },
        {
          id: 2,
          userId: 1,
          thumbnail: 'thumbnail',
          totalLike: 123,
          totalComment: 456
        },
        {
          id: 3,
          userId: 1,
          thumbnail: 'thumbnail',
          totalLike: 123,
          totalComment: 456
        },
        {
          id: 4,
          userId: 1,
          thumbnail: 'thumbnail',
          totalLike: 123,
          totalComment: 456
        },
        {
          id: 5,
          userId: 1,
          thumbnail: 'thumbnail',
          totalLike: 123,
          totalComment: 456
        },
      ])
      articleToTagRepository.getTagIds.mockReturnValue([1, 2, 3, 4, 5]);
      tagRepository.getTagNameWithIds.mockReturnValue('tagName');
    })

    it('ERROR: ?????? ????????? ????????? 404??????', async () => {
      userRepository.getUserInfo.mockResolvedValueOnce(undefined);
      try {
        const response = await service.getMypage(1, 1, 1);
        expect(response).toBeUndefined();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.response.message).toBe('No Content');
      }
    })

    it('SUCCESS: ???????????? ???????????? ????????? ??????', async () => {
      const response = await service.getMypage(1, 1, 1);
      expect(response).toEqual({
        data: {
          userInfo: {
            id: 1,
            email: 'kimcoding@gmail.com',
            nickname: 'kimcoding',
            statusMessage: 'im testing',
            profileImage: 'profileImage',
            totalFollower: 123,
            totalFollowing: 456,
            followedOrNot: true
          },
          articles: [
            {
              id: 1,
              userId: 1,
              nickname: 'kimcoding',
              profileImage: 'profileImage',
              thumbnail: 'thumbnail',
              totalLike: 123,
              totalComment: 456,
              tags: ['tagName', 'tagName', 'tagName', 'tagName', 'tagName']
            },
            {
              id: 2,
              userId: 1,
              nickname: 'kimcoding',
              profileImage: 'profileImage',
              thumbnail: 'thumbnail',
              totalLike: 123,
              totalComment: 456,
              tags: ['tagName', 'tagName', 'tagName', 'tagName', 'tagName']
            },
            {
              id: 3,
              userId: 1,
              nickname: 'kimcoding',
              profileImage: 'profileImage',
              thumbnail: 'thumbnail',
              totalLike: 123,
              totalComment: 456,
              tags: ['tagName', 'tagName', 'tagName', 'tagName', 'tagName']
            },
            {
              id: 4,
              userId: 1,
              nickname: 'kimcoding',
              profileImage: 'profileImage',
              thumbnail: 'thumbnail',
              totalLike: 123,
              totalComment: 456,
              tags: ['tagName', 'tagName', 'tagName', 'tagName', 'tagName']
            },
            {
              id: 5,
              userId: 1,
              nickname: 'kimcoding',
              profileImage: 'profileImage',
              thumbnail: 'thumbnail',
              totalLike: 123,
              totalComment: 456,
              tags: ['tagName', 'tagName', 'tagName', 'tagName', 'tagName']
            },
          ]
        },
        message: 'ok'
      })
    })
  })
});
