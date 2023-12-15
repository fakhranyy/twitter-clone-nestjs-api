import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LazyModuleLoader } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth Apis')
@Controller()
export class AuthController {
  constructor(
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) //! private readonly authService: AuthService,
  {}

  @UseGuards(LocalAuthGuard) //* check the username and password
  @Post('auth/login')
  async login(@Request() req) {
    const moduleRef = this.lazyModuleLoader.load(() => AuthModule);
    const lazySrv = (await moduleRef).get(AuthService);
    return await lazySrv.login(req.user);
  }

  @UseGuards(JwtAuthGuard) //* check if a valid Jwt exists
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
