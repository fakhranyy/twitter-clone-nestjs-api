import { Controller, Post, Put, Get, Body, UsePipes, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { User } from './entities/user.entity';
import { Userdeco } from './decorators/user.decorator'
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

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
  @UseGuards(AuthGuard) // check if the user is Authorized or back an error 401 UnAuthorized   
  async currentUser(
    @Userdeco() user: User
    ): Promise<UserResponseInterface> {
    console.log('user', user)
    return this.srv.buildUserResponse(user)
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @Userdeco('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto
    ): Promise<UserResponseInterface> {
    const user = await this.srv.updateUser(currentUserId, updateUserDto);
    return this.srv.buildUserResponse(user);
    }
}
