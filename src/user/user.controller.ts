import { Controller, Post, Get, Body, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import { Userdeco } from './decorators/user.decorator'

@Controller()
export class UserController {
  constructor(private readonly srv: UserService) {}

  
/*
-> in validationPipe we need to install class-validator & class-transformer in order to use it with dto class
-----------------------------------------------------
-> validationPipe use Dto class which are already used in the same endpoint 
and i need to add validation rules from (class-validator & class-transformer) in dto class before using it to validate 
*/
@Post('users')
@UsePipes(new ValidationPipe()) 
async createUser(
    @Body('user') createUserDto: CreateUserDto, // because of @Body('user'), In postMan When i Passed params to test I should put it in object user: {id:'', email: '', etc}
  ): Promise<UserResponseInterface> {
    const user = await this.srv.createUSer(createUserDto);
    return this.srv.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') loginUserDto: LoginUserDto):Promise<UserResponseInterface>{ // UserResponseInterface is specify for frontend response 
    const user = this.srv.logIn(loginUserDto);
    return this.srv.buildUserResponse(await user);
  }

  @Get('user')
  async currentUser(
    @Userdeco('id') user: User
    ): Promise<UserResponseInterface> {
    console.log('user', user)
    return this.srv.buildUserResponse(user)
  }
}
