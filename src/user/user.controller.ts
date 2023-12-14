import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  UseGuards,
  Patch,
  Param,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Userdeco } from './decorators/user.decorator';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LazyModuleLoader } from '@nestjs/core';
import { UserModule } from './user.module';
import { BackendValidationPipe } from 'src/common/pipes/backendValidation.pipe';
import { Request } from 'express';

@Controller()
@ApiTags('Users Apis')
export class UserController {
  // constructor(private readonly srv: UserService) {}
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  /*
-> in validationPipe we need to install class-validator & class-transformer in order to use it with dto class
-----------------------------------------------------
-> validationPipe use Dto class which are already used in the same endpoint 
and i need to add validation rules from (class-validator & class-transformer) in dto class before using it to validate 
*/
  @ApiAcceptedResponse({ description: 'Get all users' })
  @Get('users')
  async findAll(@Req() request: Request): Promise<User[]> {
    const moduleRef = this.lazyModuleLoader.load(() => UserModule);
    const lazySrv = (await moduleRef).get(UserService);
    return await lazySrv.findAll();
  }

  @ApiCreatedResponse({ description: 'Create user', type: User })
  @Post('user')
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto, // because of @Body('user'), In postMan When i Passed params to test I should put it in object user: {id:'', email: '', etc}
  ): Promise<User> {
    const moduleRef = this.lazyModuleLoader.load(() => UserModule);
    const lazySrv = (await moduleRef).get(UserService);
    const user = await lazySrv.createUSer(createUserDto);
    return lazySrv.buildUserResponse(user);
  }

  @ApiAcceptedResponse({ description: 'Get the current user' })
  @Get('users/:username')
  // @UseGuards(AuthGuard) // check if the user is Authorized or back an error 401 UnAuthorized
  //! async currentUser(@Userdeco() user: User): Promise<User> {
  async currentUser(@Param('username') username: string ): Promise<User> {
    const moduleRef = this.lazyModuleLoader.load(() => UserModule);
    const lazySrv = (await moduleRef).get(UserService);
    return await lazySrv.findOne(username)
  }

  @ApiAcceptedResponse({ description: 'Update the specific user' })
  @Patch('user')
  // @UseGuards(AuthGuard)
  async updateCurrentUser(
    @Userdeco('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const moduleRef = this.lazyModuleLoader.load(() => UserModule);
    const lazySrv = (await moduleRef).get(UserService);
    const user = await lazySrv.updateUser(currentUserId, updateUserDto);
    return lazySrv.buildUserResponse(user);
  }
}
