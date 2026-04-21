import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'super-secret', minLength: 1 })
  @IsString()
  @MinLength(1)
  password!: string;
}
