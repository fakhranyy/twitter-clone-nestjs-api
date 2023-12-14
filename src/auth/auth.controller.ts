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

@Controller()
export class AuthController {
  constructor(private  authService: AuthService) {}

  @UseGuards(LocalAuthGuard) //* check the username and password
  @Post('auth/login')
  async login(@Request() req) {
    console.log('req' ,req.user)
    return this.authService.login(req.user);
  }
  
  @UseGuards(JwtAuthGuard) //* check if a valid Jwt exists
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
