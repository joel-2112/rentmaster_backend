import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/repositories/user.repository.interface';
import { UserMapper } from '../mappers/user.mapper';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.getAllUsers();
    return this.userMapper.toResponseDtoList(users);
  }

  async getSingleUser(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException(`ተጠቃሚ በID '${id}' አልተገኘም`);
    }
    return this.userMapper.toResponseDto(user);
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`ተጠቃሚ በኢሜይል '${email}' አልተገኘም`);
    }
    return this.userMapper.toResponseDto(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(`ኢሜይል '${createUserDto.email}' አስቀድሞ ተመዝግቧል`);
    }

    const userEntity = this.userMapper.toEntityFromCreate(createUserDto);
    const newUser = await this.userRepository.createUser(userEntity);
    return this.userMapper.toResponseDto(newUser);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const userExists = await this.userRepository.userExists(id);
    if (!userExists) {
      throw new NotFoundException(`ተጠቃሚ በID '${id}' አልተገኘም`);
    }

    const updatedUser = await this.userRepository.updateUser(id, updateUserDto);
    return this.userMapper.toResponseDto(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const userExists = await this.userRepository.userExists(id);
    if (!userExists) {
      throw new NotFoundException(`ተጠቃሚ በID '${id}' አልተገኘም`);
    }

    await this.userRepository.deleteUser(id);
  }
}