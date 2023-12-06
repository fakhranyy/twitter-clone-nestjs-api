import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
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

  async logIn(loginUserDto: LoginUserDto): Promise<User> {
    const errorResponse = {
      errors: {
        'email or password': 'is invalid',
      },
    };
    const user = await this.userRepo.findOne(
      // we use select here because in userEntity
      // we hided the password by write {select: false} and we need to use the passord to check if it's auth user
      // so we write all fields that we needed
      // then, in end of this endpoint we going to delete user.password to hide the password again because we don't need it anymore
      {
        where: { email: loginUserDto.email },
        select: ['id', 'username', 'password', 'email', 'bio', 'image'],
      },
    );

    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    delete user.password;
    return user;
  }

  async findById(id: number): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  async findOne(username: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        username: username,
      },
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

}
