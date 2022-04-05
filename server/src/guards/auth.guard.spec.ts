import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let usersService:UsersService;
  let authGuard=new AuthGuard(usersService);
  it('1. AuthGuard가 존재해야 합니다.',()=>{
    expect(authGuard).toBeDefined();
    expect(authGuard.canActivate).toBeDefined();
  })
});
