import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async createUSer() {
    return 'createUser From Service';
  }
}
