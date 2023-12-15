import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { LazyModuleLoader } from '@nestjs/core';
import { ProfileModule } from './profile.module';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  @ApiAcceptedResponse({ description: 'get profile by username' })
  @Get(':username')
  async getProfile(
    @Request() req,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ProfileModule);
    const lazySrv = (await moduleRef).get(ProfileService);
    const profile = await lazySrv.getProfile(req, profileUsername);
    return lazySrv.buildProfileResponse(profile);

    // const profile = await
  }

  @ApiCreatedResponse({ description: 'make user following other user' })
  @Post(':username/follow')
  @UseGuards(JwtAuthGuard)
  async followProfile(
    @Request() req,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ProfileModule);
    const lazySrv = (await moduleRef).get(ProfileService);
    const profile = await lazySrv.followProfile(req, profileUsername); //*   ( profileUsername ) that we want to follow
    return lazySrv.buildProfileResponse(profile); //* the response which made for the frontend
  }

  @ApiCreatedResponse({ description: 'remove user from following user ' })
  @Delete(':username/unfollow')
  @UseGuards(JwtAuthGuard)
  async unfollowProfile(
    @Request() req,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ProfileModule);
    const lazySrv = (await moduleRef).get(ProfileService);
    const profile = await lazySrv.unfollowProfile(
      req,
      profileUsername,
    ); //* ( profileUsername ) that we want to follow
    return lazySrv.buildProfileResponse(profile); //* the response which made for the frontend
  }
}
