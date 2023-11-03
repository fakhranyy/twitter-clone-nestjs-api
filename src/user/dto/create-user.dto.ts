export class CreateUserDto {
  // dto stands for data transfer object
  //  this is just a plain TypeScript class with no nestjs

  readonly username: string;

  readonly email: string;

  readonly password: string;

  /*
   and if you are asking why i'm writing readonly ?
    -> because actually this is the payload and we shouldn't change our payload

    
    ## there is a difference between an interface in typescript and a class ##
    -> ( interface ) is just a datatype and it just exists inside typescript, So it doesn't exist inside runtime in js
       That mean it(interface) doesn't work in production

    -> ( classes ) But classes actually exist in js and production
  */
}
