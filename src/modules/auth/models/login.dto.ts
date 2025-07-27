import { IsNotEmpty, IsString } from 'class-validator';

export class UsernameDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class LoginDto extends UsernameDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
