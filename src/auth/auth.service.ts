import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePasswords } from './bcrypt/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userSrv: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userSrv.findOne(username);
    if (user) {
      // then, compare the passwords (the user password $ the password that i recived as a param from req)
      //  check if they were the same by the method comparePasswords
      const matched = comparePasswords(password, user.password);
      // if they're matched (passwords equal each other) do ->
      if (matched) {
        console.log('User Validation is success!');
        return user;
        // if they're not matched (passwords equal each other) do ->
      } else {
        console.log('Password do not match !');
        return null;
      }
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
