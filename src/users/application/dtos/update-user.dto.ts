import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// ይህ ከተሰራ
export class UpdateUserDto extends PartialType(CreateUserDto) {}