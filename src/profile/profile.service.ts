import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { Follow } from './entities/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Follow) private readonly followRepo: Repository<Follow>,
  ) {}

  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepo.findOne({
      where: { username: profileUsername },
    });

    if (!user) {
      throw new HttpException("Profile doesn't exist", HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepo.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    return { ...user, following: Boolean(follow) }; //* ig the follow has record it'll be return true, and if not it'll back false
  }

  async followProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepo.findOne({
      //* this the profile which we supposed to follow it.
      where: { username: profileUsername },
    });

    if (!user) {
      throw new HttpException("Profile doesn't exist", HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      //* here i check they're differnt, Because i can't follow my acount!
      throw new HttpException(
        "Follower and Following can't be equal",
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepo.findOne({
      //* make sure that the followerId doesn't follow followingId
      where: {
        followerId: currentUserId, //* the one who follows.
        followingId: user.id, //* this the profile which we supposed to follow it.
      },
    });

    if (!follow) {
      //* And If the follower doesn't follow following, we'll do some magic that nake the follower follow the following user
      const followToCreate = new Follow();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepo.save(followToCreate);
    }
    return { ...user, following: true }; //* restructure user with adding new property into it (following)
  }

  async unfollowProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepo.findOne({
      //* this the profile which we supposed to follow it.
      where: { username: profileUsername },
    });

    if (!user) {
      throw new HttpException("Profile doesn't exist", HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      //* here i check they're differnt, Because i can't follow my acount!
      throw new HttpException(
        "Follower and Following can't be equal",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepo.delete({
      //* unfollow the user
      followerId: currentUserId,
      followingId: user.id,
    });

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
