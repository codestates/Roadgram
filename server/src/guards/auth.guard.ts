import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateToken(request);
  }

  private validateToken(req: any) {
    const accessToken: string = req.headers.authorization;
    const id = +(req.body.user || req.query.user);
    const loginMethod = req.body.loginMethod===0||req.body.loginMethod?req.body.loginMethod:+req.query.loginmethod;
    return this.usersService.validateToken(accessToken,id,loginMethod);
  }
}
