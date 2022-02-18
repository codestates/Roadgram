import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthDto } from 'src/users/dto/auth.dto';
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
    const id: number = +(req.body.user || req.query.user);
    const loginMethod: number = req.body.loginMethod === 0 || req.body.loginMethod ? +req.body.loginMethod : +req.query.loginMethod;
    const authDto: AuthDto = { id, loginMethod, accessToken };
    if(!id||(!loginMethod&&loginMethod!==0)||!accessToken) throw new BadRequestException("bad request")
    return this.usersService.validateToken(authDto);
  }
}
