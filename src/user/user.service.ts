import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  async createUSer(createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
