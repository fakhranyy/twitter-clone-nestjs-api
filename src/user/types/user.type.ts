import { User } from '../entities/user.entity';
export type UserType = Omit<User, 'hashPassword' | 'hashNewPassword' | 'checkPassword'>; // omit is a typescript advanced stuff
/*
 what we want to do here is just simply omit from our user entity one property
which means our new user type is exactly user entity so all properties but execpt of hashPassword
*/
    