// src/users/domain/entities/user.entity.ts
export class UserEntity {
  id: string;
  name: string;
  email: string;
  nationalId: string;
  phone: string;
  role: string;
  isVerified: boolean;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}