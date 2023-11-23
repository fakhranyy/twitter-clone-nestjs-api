import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.repo.findOne({
      where: { username: profileUsername },
    });

    if (!user) {
      throw new HttpException("Profile doesn't exist", HttpStatus.NOT_FOUND);
    }

    return { ...user, following: false }; //* restructure user with adding new property into it (following)
  }

  async buildProfileResponse(
    profile: ProfileType,
  ): Promise<ProfileResponseInterface> {
    //* this part is only for view
    delete profile.email;
    return { profile };
  }
}
