import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsernameDto {
  @ApiProperty({ example: 'mjhonson' })
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class LoginDto extends UsernameDto {
  @ApiProperty({ example: '********' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
