import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';
import { Follow } from './entities/follow.entity';
import { FollowService } from './follow.service';
import { FollowRepository } from './repositories/follow.repository';

describe('FollowService', () => {
  let service: FollowService;
  let followRepository: MockRepository<Follow>;
  let userRepository: MockRepository<User>;
  let total_follower = 10;

  type MockRepository<T = any> = Partial<Record<any, jest.Mock>>;

  const mockFollowRepository = () => ({
    followedOrNot: jest.fn(),
    follow: jest.fn().mockImplementation(() => 'followed this user'),
    unfollow: jest.fn().mockImplementation(() => 'unfollowed this user'),
    getFollowedIds: jest.fn().mockResolvedValue([1, 2, 3]),
    getFollowingIds: jest.fn().mockResolvedValue([1, 2, 3])
  });

  const mockUserRepository = () => ({
    followIncrement: jest.fn().mockResolvedValue({ id: 1, totalFollower: total_follower + 1}),
    followDecrement: jest.fn().mockResolvedValue({ id: 1, totalFollower: total_follower - 1}),
    getProfileList: jest.fn().mockResolvedValue([
          {
            id: 1,
            nickname: 'dummy user1',
            profileImage: 'profileImage'
          },
          {
            id: 2,
            nickname: 'dummy user2',
            profileImage: 'profileImage'
          },
          {
            id: 3,
            nickname: 'dummy user3',
            profileImage: 'profileImage'
          }
        ])
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        {
          provide: getRepositoryToken(FollowRepository),
          useValue: mockFollowRepository()
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository()
        }
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
    followRepository = module.get(getRepositoryToken(FollowRepository));
    userRepository = module.get(getRepositoryToken(UserRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('1. followUnfollow 테스트', () => {
    beforeEach(() => {
      
    });

    it('SUCCESS: 다른 사용자 팔로잉 추가에 대한 응답 반환', async () => {
      followRepository.followedOrNot.mockResolvedValueOnce(false);

      const followDto = {
        loginMethod: 0,
        user: 1,
        followingUserId: 3
      };

      const expectedResult = {
        data: {
          id: followDto.user,
          totalFollower: 11
        },
        message: 'followed this user'
      };

      const result = await service.followUnfollow(followDto);

      expect(followRepository.followedOrNot).toHaveReturned();
      expect(followRepository.follow).toHaveBeenCalled();
      expect(userRepository.followIncrement).toHaveBeenCalled();
      expect(followRepository.unfollow).toBeCalledTimes(0);
      expect(userRepository.followDecrement).toBeCalledTimes(0);
      expect(result.data).toEqual(expectedResult.data);
      expect(result.message).toEqual(expectedResult.message);
    });

    it('SUCCESS: 다른 사용자 팔로잉 취소에 대한 응답 반환', async () => {
      followRepository.followedOrNot.mockResolvedValueOnce(true);

      const followDto = {
        loginMethod: 0,
        user: 1,
        followingUserId: 3
      };

      const expectedResult = {
        data: {
          id: followDto.user,
          totalFollower: 9
        },
        message: 'unfollowed this user'
      };

      const result = await service.followUnfollow(followDto);

      expect(followRepository.followedOrNot).toHaveReturned();
      expect(followRepository.follow).toBeCalledTimes(0);
      expect(userRepository.followIncrement).toBeCalledTimes(0);
      expect(followRepository.unfollow).toHaveBeenCalled();
      expect(userRepository.followDecrement).toHaveBeenCalled();
      expect(result.data).toEqual(expectedResult.data);
      expect(result.message).toEqual(expectedResult.message);
    });

    it('ERROR: 존재하지 않는 사용자에 대한 팔로잉 요청 에러 반환', async () => {
      followRepository.followedOrNot.mockResolvedValueOnce(undefined);

      const followDto = {
        loginMethod: 0,
        user: 1,
        followingUserId: 3
      };

      try {
        await service.followUnfollow(followDto);
      } catch (err) {
        expect(followRepository.followedOrNot).toHaveBeenCalled();
        expect(followRepository.follow).toBeCalledTimes(0);
        expect(userRepository.followIncrement).toBeCalledTimes(0);
        expect(followRepository.unfollow).toBeCalledTimes(0);
        expect(userRepository.followDecrement).toBeCalledTimes(0);
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.status).toBe(404);
        expect(err.response.message).toEqual(`no user with ID ${followDto.followingUserId}`);
      }
    });
  });

  describe('2. getFollowerList 테스트', () => {
    it('SUCCESS: 해당 사용자를 팔로잉하는 사용자 목록 조회 응답 반환', async () => {
      const user = 1;
      const page = 1;

      const expectedResult = {
        data: [
          {
            id: 1,
            nickname: 'dummy user1',
            profileImage: 'profileImage'
          },
          {
            id: 2,
            nickname: 'dummy user2',
            profileImage: 'profileImage'
          },
          {
            id: 3,
            nickname: 'dummy user3',
            profileImage: 'profileImage'
          },
        ],
        message: 'follower list'
      };

      const result = await service.getFollowerList(user, page);

      expect(followRepository.getFollowedIds).toHaveBeenCalled();
      expect(userRepository.getProfileList).toHaveBeenCalled();
      expect(result.data).toEqual(expectedResult.data);
      expect(result.message).toEqual(expectedResult.message);
    });

    it('ERROR: 존재하지 않는 사용자의 ID를 요청받았을 경우 에러 반환', async () => {
      const user = 9999;
      const page = 1;

      followRepository.getFollowedIds.mockResolvedValueOnce([]);

      try {
        await service.getFollowerList(user, page);
      } catch (err) {
        expect(followRepository.getFollowedIds).toHaveBeenCalled();
        expect(userRepository.getProfileList).toBeCalledTimes(0);
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.status).toEqual(404);
        expect(err.response.message).toEqual('cannot find the user or followers');
      };
    });

    it('ERROR: 0 이하의 정수로 page 쿼리를 요청받았을 경우 에러 반환', async () => {
      const user = 1;
      const page = 0;

      try {
        await service.getFollowerList(user, page);
      } catch (err) {
        expect(userRepository.getProfileList).toBeCalledTimes(0);
        expect(err).toBeInstanceOf(NotAcceptableException);
        expect(err.status).toEqual(406);
        expect(err.response.message).toEqual('unavailable page query');
      };
    });

    it('ERROR: 팔로워 중 한 번에 10명 이상 조회됐을 경우 에러 반환', async () => {
      const user = 1;
      const page = 1;

      userRepository.getProfileList.mockResolvedValueOnce([
        {
          id: 1,
          nickname: 'dummy user1',
          profileImage: 'profileImage'
        },
        {
          id: 2,
          nickname: 'dummy user2',
          profileImage: 'profileImage'
        },
        {
          id: 3,
          nickname: 'dummy user3',
          profileImage: 'profileImage'
        },
        {
          id: 4,
          nickname: 'dummy user4',
          profileImage: 'profileImage'
        },
        {
          id: 5,
          nickname: 'dummy user5',
          profileImage: 'profileImage'
        },
        {
          id: 6,
          nickname: 'dummy user6',
          profileImage: 'profileImage'
        },
        {
          id: 7,
          nickname: 'dummy user7',
          profileImage: 'profileImage'
        },
        {
          id: 8,
          nickname: 'dummy user8',
          profileImage: 'profileImage'
        },
        {
          id: 9,
          nickname: 'dummy user9',
          profileImage: 'profileImage'
        },
        {
          id: 10,
          nickname: 'dummy user10',
          profileImage: 'profileImage'
        },
        {
          id: 11,
          nickname: 'dummy user11',
          profileImage: 'profileImage'
        },
        {
          id: 12,
          nickname: 'dummy user12',
          profileImage: 'profileImage'
        }
      ]);

      try {
        await service.getFollowerList(user, page);
      } catch (err) {
        expect(userRepository.getProfileList).toHaveBeenCalled();
        expect(err).toBeInstanceOf(NotAcceptableException);
        expect(err.status).toEqual(406);
        expect(err.response.message).toEqual('list more than 10 users');
      };
    });
  });

  describe('3. getFollowingList 테스트', () => {
    it('SUCCESS: 해당 사용자가 팔로잉하는 사용자 목록 조회 응답 반환', async () => {
      const user = 1;
      const page = 1;

      const expectedResult = {
        data: [
          {
            id: 1,
            nickname: 'dummy user1',
            profileImage: 'profileImage'
          },
          {
            id: 2,
            nickname: 'dummy user2',
            profileImage: 'profileImage'
          },
          {
            id: 3,
            nickname: 'dummy user3',
            profileImage: 'profileImage'
          },
        ],
        message: 'following list'
      };

      const result = await service.getFollowingList(user, page);

      expect(followRepository.getFollowingIds).toHaveBeenCalled();
      expect(userRepository.getProfileList).toHaveBeenCalled();
      expect(result.data).toEqual(expectedResult.data);
      expect(result.message).toEqual(expectedResult.message);
    });

    it('ERROR: 존재하지 않는 사용자의 ID를 요청받았을 경우 에러 반환', async () => {
      const user = 9999;
      const page = 1;

      followRepository.getFollowingIds.mockResolvedValueOnce([]);

      try {
        await service.getFollowingList(user, page);
      } catch (err) {
        expect(followRepository.getFollowingIds).toHaveBeenCalled();
        expect(userRepository.getProfileList).toBeCalledTimes(0);
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.status).toEqual(404);
        expect(err.response.message).toEqual('cannot find the user or followings');
      };
    });

    it('ERROR: 0 이하의 정수로 page 쿼리를 요청받았을 경우 에러 반환', async () => {
      const user = 1;
      const page = 0;

      try {
        await service.getFollowingList(user, page);
      } catch (err) {
        expect(userRepository.getProfileList).toBeCalledTimes(0);
        expect(err).toBeInstanceOf(NotAcceptableException);
        expect(err.status).toEqual(406);
        expect(err.response.message).toEqual('unavailable page query');
      };
    });

    it('ERROR: 팔로잉 중 한 번에 10명 이상 조회됐을 경우 에러 반환', async () => {
      const user = 1;
      const page = 1;

      userRepository.getProfileList.mockResolvedValueOnce([
        {
          id: 1,
          nickname: 'dummy user1',
          profileImage: 'profileImage'
        },
        {
          id: 2,
          nickname: 'dummy user2',
          profileImage: 'profileImage'
        },
        {
          id: 3,
          nickname: 'dummy user3',
          profileImage: 'profileImage'
        },
        {
          id: 4,
          nickname: 'dummy user4',
          profileImage: 'profileImage'
        },
        {
          id: 5,
          nickname: 'dummy user5',
          profileImage: 'profileImage'
        },
        {
          id: 6,
          nickname: 'dummy user6',
          profileImage: 'profileImage'
        },
        {
          id: 7,
          nickname: 'dummy user7',
          profileImage: 'profileImage'
        },
        {
          id: 8,
          nickname: 'dummy user8',
          profileImage: 'profileImage'
        },
        {
          id: 9,
          nickname: 'dummy user9',
          profileImage: 'profileImage'
        },
        {
          id: 10,
          nickname: 'dummy user10',
          profileImage: 'profileImage'
        },
        {
          id: 11,
          nickname: 'dummy user11',
          profileImage: 'profileImage'
        },
        {
          id: 12,
          nickname: 'dummy user12',
          profileImage: 'profileImage'
        }
      ]);

      try {
        await service.getFollowingList(user, page);
      } catch (err) {
        expect(userRepository.getProfileList).toHaveBeenCalled();
        expect(err).toBeInstanceOf(NotAcceptableException);
        expect(err.status).toEqual(406);
        expect(err.response.message).toEqual('list more than 10 users');
      };
    });
  });
});
