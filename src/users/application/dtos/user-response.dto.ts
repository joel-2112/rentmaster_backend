export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  role: string;
  isVerified: boolean;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}