import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(request: Request): Promise<User[]> {
    const user = request;
    return await this.userRepo.find();
  }

  async createUSer(createUserDto: CreateUserDto): Promise<User> {
    const errorResponse = {
      errors: {},
    };
    const userByEmail = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    const userByUsername = await this.userRepo.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
    }

    if (userByUsername) {
      errorResponse.errors['username'] = 'has already been taken';
    }

    if (userByEmail || userByUsername) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new User();
    Object.assign(newUser, createUserDto); // we Assigned all properties from createUserDto inside our newUser
    return await this.userRepo.save(newUser);
  }

  async findById(id: number): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  async findOne(username: string): Promise<User> {
    return await this.userRepo.findOne({
      where: { username: username },
      select: ['password', 'username', 'email', 'id', 'bio', 'image'],
    });
  }

  async updateUser(
    currentUserId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findById(currentUserId);
    Object.assign(user, updateUserDto); //  Object.assign(target, source)
    return await this.userRepo.save(user);
  }

  buildUserResponse(user: User): User {
    return user;
  }
}
