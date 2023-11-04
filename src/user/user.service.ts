import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from './config';
import { UserResponseInterface } from './types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}
  async createUSer(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, createUserDto); // we Assigned all properties from createUserDto inside our newUser
    return await this.repo.save(newUser);
  }

  generateJwt(user: User): string {
    return sign(
      // must back to us a string because jwt is just a string
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }
  // we're using Dto only for payload
  buildUserResponse(user: User): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
