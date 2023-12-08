import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private userSrv: UserService,
    private jwtService: JwtService
  ) {}

  // async signIn(username: string, password: string) {
    async signIn(signInDto: SignInDto) {
    const user = await this.userSrv.findOne(signInDto.username);
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

// Ideally, instead of using the Record<string, any> type, we should use a DTO class to define the shape of the request body. See the validation chapter for more information.
