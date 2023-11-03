import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly srv: UserService){}
  @Post('users')
  async createUser(): Promise<any> {
    return this.srv.createUSer();
  }
}
