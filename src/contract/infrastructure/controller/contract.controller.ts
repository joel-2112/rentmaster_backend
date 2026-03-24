import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ContractUseCase } from '../../application/use-cases/contract.use-case';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Role } from '../../../common/constants/roles.enum';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

// DTOs
import { CreateContractDto } from '../../application/dtos/create-contract.dto';
import { UpdateContractDto } from '../../application/dtos/update-contract.dto';
import { ContractResponseDto } from '../../application/dtos/contract-response.dto';
import { ContractStatus } from '../../application/dtos/contract-status.enum';

@Controller('contracts')
@UseGuards(AuthGuard, RolesGuard)
export class ContractController {
  constructor(private readonly contractUseCase: ContractUseCase) {}

  // ==================== የውል ማስተዳደር ኤንድፖይንቶች ====================

  /**
   * @POST    /contracts
   * @desc    አዲስ የኪራይ ውል መፍጠር
   * @access  LANDLORD, TENANT, BROKER, SUPER_ADMIN
   */
  @Post()
  @Roles(Role.LANDLORD, Role.TENANT, Role.BROKER, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createContractController(
    @Body() createContractDto: CreateContractDto,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    return this.contractUseCase.createContract(
      createContractDto,
      user.id,
      user.role,
    );
  }

  /**
   * @GET     /contracts
   * @desc    ሁሉንም ውሎች ማግኘት (ለሱፐር አድሚን ብቻ)
   * @access  SUPER_ADMIN
   */
  @Get()
  @Roles(Role.SUPER_ADMIN)
  async getAllContractsController(
    @Query('status') status?: ContractStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    if (status) {
      return this.contractUseCase.getContractsByStatus(status, page, limit);
    }
    // ለሱፐር አድሚን ሁሉንም ማግኘት አለበት
    // ይሄ በUseCase ውስጥ መጨመር ያስፈልጋል
    return { data: [], total: 0 };
  }

  /**
   * @GET     /contracts/my/tenant
   * @desc    ተከራይ የራሱን ውሎች ማግኘት
   * @access  TENANT
   */
  @Get('my/tenant')
  @Roles(Role.TENANT)
  async getMyTenantContractsController(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    return this.contractUseCase.getContractsByTenant(user.id, page, limit);
  }

  /**
   * @GET     /contracts/my/landlord
   * @desc    አከራይ የራሱን ውሎች ማግኘት
   * @access  LANDLORD
   */
  @Get('my/landlord')
  @Roles(Role.LANDLORD)
  async getMyLandlordContractsController(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    return this.contractUseCase.getContractsByLandlord(user.id, page, limit);
  }

  /**
   * @GET     /contracts/my/broker
   * @desc    ደላላ የራሱን ውሎች ማግኘት
   * @access  BROKER
   */
  @Get('my/broker')
  @Roles(Role.BROKER)
  async getMyBrokerContractsController(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    return this.contractUseCase.getContractsByBroker(user.id, page, limit);
  }

  /**
   * @GET     /contracts/tenant/:tenantId
   * @desc    በተከራይ የሚገኙ ውሎችን ማግኘት
   * @access  SUPER_ADMIN, LANDLORD, BROKER
   */
  @Get('tenant/:tenantId')
  @Roles(Role.SUPER_ADMIN, Role.LANDLORD, Role.BROKER)
  async getContractsByTenantController(
    @Param('tenantId') tenantId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    return this.contractUseCase.getContractsByTenant(tenantId, page, limit);
  }

  /**
   * @GET     /contracts/landlord/:landlordId
   * @desc    በአከራይ የሚገኙ ውሎችን ማግኘት
   * @access  SUPER_ADMIN, TENANT, BROKER
   */
  @Get('landlord/:landlordId')
  @Roles(Role.SUPER_ADMIN, Role.TENANT, Role.BROKER)
  async getContractsByLandlordController(
    @Param('landlordId') landlordId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    return this.contractUseCase.getContractsByLandlord(landlordId, page, limit);
  }

  /**
   * @GET     /contracts/property/:propertyId
   * @desc    በቤት የሚገኙ ውሎችን ማግኘት
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get('property/:propertyId')
  async getContractsByPropertyController(
    @Param('propertyId') propertyId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    return this.contractUseCase.getContractsByProperty(propertyId, page, limit);
  }

  /**
   * @GET     /contracts/status/:status
   * @desc    በሁኔታ የሚገኙ ውሎችን ማግኘት
   * @access  SUPER_ADMIN
   */
  @Get('status/:status')
  @Roles(Role.SUPER_ADMIN)
  async getContractsByStatusController(
    @Param('status') status: ContractStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    return this.contractUseCase.getContractsByStatus(status, page, limit);
  }

  /**
   * @GET     /contracts/:id
   * @desc    አንድ ውል በID ማግኘት
   * @access  TENANT, LANDLORD, BROKER (የራሳቸው), SUPER_ADMIN
   */
  @Get(':id')
  async getContractByIdController(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    // ፈቃድ ማረጋገጫ በUseCase ውስጥ ይከናወናል
    return this.contractUseCase.getContractById(id);
  }

  /**
   * @PUT     /contracts/:id
   * @desc    ውል ማዘመን (DRAFT ሁኔታ ላይ ብቻ)
   * @access  TENANT, LANDLORD, BROKER (የራሳቸው), SUPER_ADMIN
   */
  @Put(':id')
  @Roles(Role.TENANT, Role.LANDLORD, Role.BROKER, Role.SUPER_ADMIN)
  async updateContractController(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    return this.contractUseCase.updateContract(
      id,
      updateContractDto,
      user.id,
      user.role,
    );
  }

  /**
   * @DELETE  /contracts/:id
   * @desc    ውል መሰረዝ
   * @access  SUPER_ADMIN ብቻ
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteContractController(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<void> {
    await this.contractUseCase.deleteContract(id, user.role);
  }

  // ==================== የውል ፊርማ ኤንድፖይንቶች ====================

  /**
   * @POST    /contracts/:id/sign/landlord
   * @desc    በአከራይ ፊርማ
   * @access  LANDLORD (የራሱን ውል)
   */
  @Post(':id/sign/landlord')
  @Roles(Role.LANDLORD)
  @HttpCode(HttpStatus.OK)
  async signByLandlordController(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    return this.contractUseCase.signByLandlord(id, user.id);
  }

  /**
   * @POST    /contracts/:id/sign/tenant
   * @desc    በተከራይ ፊርማ
   * @access  TENANT (የራሱን ውል)
   */
  @Post(':id/sign/tenant')
  @Roles(Role.TENANT)
  @HttpCode(HttpStatus.OK)
  async signByTenantController(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    return this.contractUseCase.signByTenant(id, user.id);
  }

  /**
   * @POST    /contracts/:id/sign/broker
   * @desc    በደላላ ፊርማ
   * @access  BROKER (የራሱን ውል)
   */
  @Post(':id/sign/broker')
  @Roles(Role.BROKER)
  @HttpCode(HttpStatus.OK)
  async signByBrokerController(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    return this.contractUseCase.signByBroker(id, user.id);
  }

  // ==================== የቀበሌ ማረጋገጫ ኤንድፖይንቶች ====================

  /**
   * @POST    /contracts/:id/approve
   * @desc    ውል ማረጋገጥ (ለቀበሌ ባለስልጣን)
   * @access  KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Post(':id/approve')
  @Roles(Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async approveContractController(
    @Param('id') id: string,
    @Body('seal') seal: string,
    @Body('notes') notes: string,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    return this.contractUseCase.approveContract(id, user.id, seal, notes);
  }

  /**
   * @POST    /contracts/:id/reject
   * @desc    ውል አለመቀበል (ለቀበሌ ባለስልጣን)
   * @access  KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Post(':id/reject')
  @Roles(Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async rejectContractController(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    return this.contractUseCase.rejectContract(id, user.id, reason);
  }

  // ==================== የውል ክትትል ኤንድፖይንቶች ====================

  /**
   * @POST    /contracts/:id/terminate
   * @desc    ውል ማጠናቀቅ
   * @access  TENANT, LANDLORD (የራሳቸውን), SUPER_ADMIN
   */
  @Post(':id/terminate')
  @Roles(Role.TENANT, Role.LANDLORD, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async terminateContractController(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    return this.contractUseCase.terminateContract(id, user.id, user.role, reason);
  }

  /**
   * @POST    /contracts/:id/renew
   * @desc    ውል ማደስ
   * @access  TENANT, LANDLORD (የራሳቸውን), SUPER_ADMIN
   */
  @Post(':id/renew')
  @Roles(Role.TENANT, Role.LANDLORD, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async renewContractController(
    @Param('id') id: string,
    @Body('newEndDate') newEndDate: Date,
    @CurrentUser() user: any,
  ): Promise<ContractResponseDto> {
    return this.contractUseCase.renewContract(id, newEndDate, user.id, user.role);
  }
}