import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  // @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
