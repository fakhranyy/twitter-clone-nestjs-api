import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Userdeco } from 'src/user/decorators/user.decorator';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { LazyModuleLoader } from '@nestjs/core';
import { ProfileModule } from './profile.module';

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
}
