import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true, //* We're registering the JwtModule as global to make things easier for us. This means that we don't need to import the JwtModule anywhere else in our application.
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '11140s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
