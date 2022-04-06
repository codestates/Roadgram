import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
require('dotenv').config();

const mockService = () => ({
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
  checkEmail: jest.fn(),
  checkNickname: jest.fn(),
  getTokenKakao: jest.fn(),
  modifyUser: jest.fn(),
  deleteUser: jest.fn(),
  getMypage: jest.fn(),
  refreshAccessToken: jest.fn(),
})

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockService() }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService)
  });

  it('1. login 테스트', () => {
    controller.login({ email: '', password: '' });
    expect(service.login).toBeCalledTimes(1);
  });

  it('2. logout 테스트', () => {
    controller.logout({ loginMethod: 1, user: 1 });
    expect(service.logout).toBeCalledTimes(1);
  });

  it('3. signup 테스트', () => {
    controller.signup({ email: '', password: '', nickname: '' })
    expect(service.signup).toBeCalledTimes(1);
  })

  it('4. checkEmail 테스트', () => {
    controller.checkEmail({ email: '' })
    expect(service.checkEmail).toBeCalledTimes(1);
  })

  it('5. checkNickname 테스트', () => {
    controller.checkNickname({ nickname: '' })
    expect(service.checkNickname).toBeCalledTimes(1);
  })

  it('6. getToken 테스트', () => {
    controller.getToken({ code: '' })
    expect(service.getTokenKakao).toBeCalledTimes(1);
  })

  it('7. modifyProfile 테스트', () => {
    controller.modifyProfile({ user: 1, loginMethod: 1 })
    expect(service.modifyUser).toBeCalledTimes(1);
  })

  it('8. deleteUser 테스트', () => {
    controller.deleteUser({ user: 1, loginMethod: 1 })
    expect(service.deleteUser).toBeCalledTimes(1);
  })

  it('9. getUserInfo 테스트', () => {
    controller.getUserInfo(1, 2)
    expect(service.getMypage).toBeCalledTimes(1);
  })

  it('10. refreshAccessToken 테스트', () => {
    controller.refreshAccessToken({ user: 1, loginMethod: 1 }, { authorization: '' })
    expect(service.refreshAccessToken).toBeCalledTimes(1);
  })
});
