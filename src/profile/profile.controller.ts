import { Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Userdeco } from 'src/user/decorators/user.decorator';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { LazyModuleLoader } from '@nestjs/core';
import { ProfileModule } from './profile.module';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  // constructor(private readonly profileSer: ProfileService) {}
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  @Get(':username')
  async getProfile(
    @Userdeco('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ProfileModule);
    const lazySrv = (await moduleRef).get(ProfileService);
    const profile = await lazySrv.getProfile(currentUserId, profileUsername);
    return lazySrv.buildProfileResponse(profile);

    // const profile = await
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @Userdeco('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ProfileModule);
    const lazySrv = (await moduleRef).get(ProfileService);
    const profile = await lazySrv.followProfile(currentUserId, profileUsername); //*   ( profileUsername ) that we want to follow
    return lazySrv.buildProfileResponse(profile); //* the response which made for the frontend
  }

  @Delete(':username/unfollow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @Userdeco('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const moduleRef = this.lazyModuleLoader.load(() => ProfileModule);
    const lazySrv = (await moduleRef).get(ProfileService);
    const profile = await lazySrv.unfollowProfile(currentUserId, profileUsername); //* ( profileUsername ) that we want to follow
    return lazySrv.buildProfileResponse(profile); //* the response which made for the frontend
  }
}
