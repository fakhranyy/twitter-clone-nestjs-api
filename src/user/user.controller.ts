import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly srv: UserService) {}
  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<User> {
    const user = await this.srv.createUSer(createUserDto);
    return this.srv.buildUserResponse(user);
  }
}
