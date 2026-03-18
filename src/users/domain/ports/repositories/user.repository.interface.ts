import { UserEntity } from '../../entities/user.entity';

export interface IUserRepository {
  getAllUsers(): Promise<UserEntity[]>;
  getUserById(id: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  getUserByPhone(phone: string): Promise<UserEntity | null>;
  createUser(user: Partial<UserEntity>): Promise<UserEntity>;
  updateUser(id: string, user: Partial<UserEntity>): Promise<UserEntity>;
  deleteUser(id: string): Promise<void>;
  userExists(id: string): Promise<boolean>;
}