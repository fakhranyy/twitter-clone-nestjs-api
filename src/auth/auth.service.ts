import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSrv: UserService,
    private readonly jwtSrv: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userSrv.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    //! delete user.password;
    //! return user;
    //! const { password, ...result } = user;
    // TODO: Generate a JWT and return it here

    const payload = { sub: user.id, username: user.username };
    return {
      user,
      access_token: await this.jwtSrv.signAsync(payload),
    };
    //* instead of the user object
    //! return result;
  }
}
