import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let usersService:UsersService;
  let authGuard=new AuthGuard(usersService);
  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });
});
