import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name of user',
    example: 'name',
  })
  name: string;
}
