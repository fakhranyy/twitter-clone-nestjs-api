import { UserType } from './user.type';

export interface UserResponseInterface {
  // this interface is a mix of entity and our token and we can solve this problem by some advanced typescript
  user: UserType & { token: string };
  /*
  - So why I'm writing like this ?
  -> because actually we want to have new interface,
     but we don't want to specify that inside all properties from user entity
     because it doesn't make any sense, then it will be just a duplicate from user entity but without (hashPassword)

  -> so actually we want to have all properties from user entity but additional token property
  */
}
