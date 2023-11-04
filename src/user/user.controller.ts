import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/userResponse.interface';

@Controller()
export class UserController {
  constructor(private readonly srv: UserService) {}
  @Post('users')
  // because of @Body('user'), In postMan When i Passed params to test I should put it in object user: {id:'', email: '', etc}
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.srv.createUSer(createUserDto);
    return this.srv.buildUserResponse(user);
  }
}
