import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}
  async createUSer(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, createUserDto); // we assigned all properties from createUserDto inside our newUser
    return await this.repo.save(newUser);
  }
}
