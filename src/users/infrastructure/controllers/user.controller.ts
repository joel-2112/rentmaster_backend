import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { Role } from '../../../common/constants/roles.enum';
import { UserUseCase } from '../../application/use-cases/user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';

@Controller('users')
@UseGuards(AuthGuard) // ሁሉም መንገዶች በAuthGuard ይጠበቃሉ (Public ካልሆነ በስተቀር)
export class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}

  // ሁሉንም ተጠቃሚዎች ማግኘት (Super Admin ብቻ)
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getAllUsersController(): Promise<UserResponseDto[]> {
    return await this.userUseCase.getAllUsers();
  }

  // የራስን ፕሮፋይል ማግኘት
  @Get('profile/me')
  async getMyProfileController(@CurrentUser() user: any): Promise<UserResponseDto> {
    return await this.userUseCase.getSingleUser(user.id);
  }

  // አንድ ተጠቃሚ በ ID ማግኘት (Super Admin ብቻ)
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getSingleUserController(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.userUseCase.getSingleUser(id);
  }

  // አዲስ ተጠቃሚ መፍጠር (Public - ምዝገባ)
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUserController(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userUseCase.createUser(createUserDto);
  }

  // የራስን መረጃ ማዘመን
  @Put('profile/me')
  async updateMyProfileController(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userUseCase.updateUser(user.id, updateUserDto);
  }

  // አንድ ተጠቃሚ ማዘመን (Super Admin ብቻ)
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateUserController(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userUseCase.updateUser(id, updateUserDto);
  }

  // የራስን አካውንት መሰረዝ
  @Delete('profile/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMyProfileController(@CurrentUser() user: any): Promise<void> {
    await this.userUseCase.deleteUser(user.id);
  }

  // አንድ ተጠቃሚ መሰረዝ (Super Admin ብቻ)
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserController(@Param('id') id: string): Promise<void> {
    await this.userUseCase.deleteUser(id);
  }
}