import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); //* You pass the strategy options by calling the super() method in your subclass
  }

//   async validate(username: string, password: string): Promise<any> {
    async validate(signInDto: SignInDto): Promise<any> {
    const user = await this.authService.login(signInDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
