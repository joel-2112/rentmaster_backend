import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IUserRepository } from '../../../domain/ports/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Prisma, Role } from '@prisma/client'; 

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => new UserEntity(user));
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? new UserEntity(user) : null;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? new UserEntity(user) : null;
  }

  async getUserByPhone(phone: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });
    return user ? new UserEntity(user) : null;
  }

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    const data: Prisma.UserCreateInput = {
      id: user.id,
      name: user.name!,
      email: user.email!,
      nationalId: user.nationalId!,
      phone: user.phone!,
      role: user.role as Role,
      isVerified: user.isVerified ?? false,
      emailVerified: user.emailVerified ?? false,
      image: user.image,
    };

    const newUser = await this.prisma.user.create({
      data,
    });
    return new UserEntity(newUser);
  }

  async updateUser(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    // የ Prisma ዳታ አዘጋጅ
    const data: Prisma.UserUpdateInput = {};
    
    if (user.name) data.name = user.name;
    if (user.email) data.email = user.email;
    if (user.nationalId) data.nationalId = user.nationalId;
    if (user.phone) data.phone = user.phone;
    if (user.role) data.role = user.role as Role;
    if (user.isVerified !== undefined) data.isVerified = user.isVerified;
    if (user.emailVerified !== undefined) data.emailVerified = user.emailVerified;
    if (user.image !== undefined) data.image = user.image;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return new UserEntity(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async userExists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id },
    });
    return count > 0;
  }
}