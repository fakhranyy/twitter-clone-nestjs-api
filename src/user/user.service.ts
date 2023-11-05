import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from './config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}
  async createUSer(createUserDto: CreateUserDto): Promise<User> {
    const userByEmail = await this.repo.findOne({
      where: {email: createUserDto.email},
    })
    const userByUsername = await this.repo.findOne({
      where: {username: createUserDto.username},
    })
    if(userByEmail || userByUsername) {
      throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const newUser = new User();
    Object.assign(newUser, createUserDto); // we Assigned all properties from createUserDto inside our newUser
    return await this.repo.save(newUser);
  }

  async logIn(loginUserDto: LoginUserDto): Promise<User>{
    const user = await this.repo.findOne( 
      // we use select here because in userEntity
      // we hided the password by write {select: false} and we need to use the passord to check if it's auth user
      // so we write all fields that we needed 
      // then, in end of this endpoint we going to delete user.password to hide the password again 
      {where: {email: loginUserDto.email}, select: ['id', 'username', 'password', 'email', 'bio', 'image']}
      )
    if(!user){
      throw new HttpException('credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const isPasswordCorrect = await compare(loginUserDto.password , user.password);
    if(!isPasswordCorrect){
      throw new HttpException('credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    delete user.password;
    return user;

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
