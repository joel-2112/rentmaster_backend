// src/users/application/mappers/user.mapper.ts
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserMapper {
  toEntityFromCreate(dto: CreateUserDto): Partial<UserEntity> {
    return {
      name: dto.name,
      email: dto.email,
      nationalId: dto.nationalId,
      phone: dto.phone,
      role: dto.role || 'TENANT',
      isVerified: false,
      emailVerified: false,
    };
  }

  toResponseDto(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      nationalId: entity.nationalId,
      role: entity.role,
      isVerified: entity.isVerified,
      emailVerified: entity.emailVerified,
      image: entity.image,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toResponseDtoList(entities: UserEntity[]): UserResponseDto[] {
    return entities.map(entity => this.toResponseDto(entity));
  }
}