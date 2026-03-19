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
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PropertyUseCase } from '../../application/use-cases/property.use-case';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Role } from '../../../common/constants/roles.enum';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

// DTOs
import { CreatePropertyDto } from '../../application/dtos/create-property.dto';
import { UpdatePropertyDto } from '../../application/dtos/update-property.dto';
import { PropertyResponseDto, PropertyListItemDto } from '../../application/dtos/property-response.dto';
import { PropertySearchDto, PropertySearchResponseDto } from '../../application/dtos/property-search.dto';
import { CreatePropertyInquiryDto, PropertyInquiryResponseDto } from '../../application/dtos/property-inquiry.dto';

@Controller('properties')
@UseGuards(AuthGuard, RolesGuard)
export class PropertyController {
  constructor(private readonly propertyUseCase: PropertyUseCase) {}

  // ==================== የቤት ማስተዳደር ኤንድፖይንቶች ====================

  /**
   * @POST    /properties
   * @desc    አዲስ ቤት መመዝገብ
   * @access  LANDLORD, BROKER, SUPER_ADMIN
   */
  @Post()
  @Roles(Role.LANDLORD, Role.BROKER, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createPropertyController(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.createProperty(
      createPropertyDto,
      user.id,
      user.role,
    );
  }

  /**
   * @GET     /properties
   * @desc    ሁሉንም ቤቶች ማግኘት (ከገጽ መቁጠር ጋር)
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get()
  async getAllPropertiesController(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getAllProperties(page, limit);
  }

  /**
   * @GET     /properties/search
   * @desc    ቤቶችን በተለያዩ መስፈርቶች መፈለግ
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get('search')
  async searchPropertiesController(
    @Query() searchDto: PropertySearchDto,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.searchProperties(searchDto);
  }

  /**
   * @GET     /properties/featured
   * @desc    ተለይተው የሚታዩ ቤቶችን ማግኘት
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get('featured')
  async getFeaturedPropertiesController(
    @Query('limit') limit: number = 10,
  ): Promise<PropertyListItemDto[]> {
    return this.propertyUseCase.getFeaturedProperties(limit);
  }

  /**
   * @GET     /properties/most-viewed
   * @desc    በጣም የታዩ ቤቶችን ማግኘት
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get('most-viewed')
  async getMostViewedPropertiesController(
    @Query('limit') limit: number = 10,
  ): Promise<PropertyListItemDto[]> {
    return this.propertyUseCase.getMostViewedProperties(limit);
  }

  /**
   * @GET     /properties/most-favorited
   * @desc    በጣም የተወደዱ ቤቶችን ማግኘት
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get('most-favorited')
  async getMostFavoritedPropertiesController(
    @Query('limit') limit: number = 10,
  ): Promise<PropertyListItemDto[]> {
    return this.propertyUseCase.getMostFavoritedProperties(limit);
  }

  /**
   * @GET     /properties/newest
   * @desc    አዳዲስ ቤቶችን ማግኘት
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get('newest')
  async getNewestPropertiesController(
    @Query('limit') limit: number = 10,
  ): Promise<PropertyListItemDto[]> {
    return this.propertyUseCase.getNewestProperties(limit);
  }

  /**
   * @GET     /properties/verified
   * @desc    የተረጋገጡ ቤቶችን ማግኘት
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get('verified')
  async getVerifiedPropertiesController(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getVerifiedProperties(page, limit);
  }

  /**
   * @GET     /properties/unverified
   * @desc    ያልተረጋገጡ ቤቶችን ማግኘት (ለቀበሌ ባለስልጣን)
   * @access  KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Get('unverified')
  @Roles(Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getUnverifiedPropertiesController(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getUnverifiedProperties(page, limit);
  }

  /**
   * @GET     /properties/my
   * @desc    የተጠቃሚውን ቤቶች ማግኘት (ለባለቤት ወይም ደላላ)
   * @access  LANDLORD, BROKER
   */
  @Get('my')
  @Roles(Role.LANDLORD, Role.BROKER)
  async getMyPropertiesController(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PropertySearchResponseDto> {
    if (user.role === Role.LANDLORD) {
      return this.propertyUseCase.getPropertiesByLandlord(user.id, page, limit);
    } else {
      return this.propertyUseCase.getPropertiesByBroker(user.id, page, limit);
    }
  }

  /**
   * @GET     /properties/landlord/:landlordId
   * @desc    በባለቤት የሚገኙ ቤቶችን ማግኘት
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get('landlord/:landlordId')
  async getPropertiesByLandlordController(
    @Param('landlordId') landlordId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getPropertiesByLandlord(landlordId, page, limit);
  }

  /**
   * @GET     /properties/broker/:brokerId
   * @desc    በደላላ የሚተዳደሩ ቤቶችን ማግኘት
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get('broker/:brokerId')
  async getPropertiesByBrokerController(
    @Param('brokerId') brokerId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getPropertiesByBroker(brokerId, page, limit);
  }

  /**
   * @GET     /properties/:id
   * @desc    አንድ ቤት በID ማግኘት
   * @access  ሁሉም (Public)
   */
  @Public()
  @Get(':id')
  async getPropertyByIdController(
    @Param('id') id: string,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.getPropertyById(id);
  }

  /**
   * @PUT     /properties/:id
   * @desc    ቤት ማዘመን
   * @access  LANDLORD (የራሱን), BROKER (የሚያስተዳድረውን), SUPER_ADMIN
   */
  @Put(':id')
  @Roles(Role.LANDLORD, Role.BROKER, Role.SUPER_ADMIN)
  async updatePropertyController(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.updateProperty(
      id,
      updatePropertyDto,
      user.id,
      user.role,
    );
  }

  /**
   * @DELETE  /properties/:id/soft
   * @desc    ቤት ለስላሳ ሰርዝ
   * @access  LANDLORD (የራሱን), BROKER (የሚያስተዳድረውን), SUPER_ADMIN
   */
  @Delete(':id/soft')
  @Roles(Role.LANDLORD, Role.BROKER, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async softDeletePropertyController(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.softDeleteProperty(id, user.id, user.role);
  }

  /**
   * @DELETE  /properties/:id/hard
   * @desc    ቤት ሙሉ በሙሉ መሰረዝ
   * @access  SUPER_ADMIN ብቻ
   */
  @Delete(':id/hard')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDeletePropertyController(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<void> {
    await this.propertyUseCase.hardDeleteProperty(id, user.role);
  }

  // ==================== የቤት ማረጋገጫ ኤንድፖይንቶች ====================

  /**
   * @PUT     /properties/:id/verify
   * @desc    ቤት ማረጋገጥ (ለቀበሌ ባለስልጣን)
   * @access  KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Put(':id/verify')
  @Roles(Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async verifyPropertyController(
    @Param('id') id: string,
    @Body('seal') seal: string,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.verifyProperty(id, user.id, seal);
  }

  /**
   * @PUT     /properties/:id/renew-seal
   * @desc    የቤት ማህተም ማደስ
   * @access  KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Put(':id/renew-seal')
  @Roles(Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async renewPropertySealController(
    @Param('id') id: string,
    @Body('seal') seal: string,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.renewPropertySeal(id, user.id, seal);
  }

  /**
   * @PUT     /properties/:id/feature
   * @desc    ቤት ማሳደግ (featured)
   * @access  KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Put(':id/feature')
  @Roles(Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async featurePropertyController(
    @Param('id') id: string,
    @Body('priority') priority: number = 1,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.featureProperty(id, priority, user.id, user.role);
  }

  /**
   * @PUT     /properties/:id/unfeature
   * @desc    ማሳደግን ማስወገድ
   * @access  KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Put(':id/unfeature')
  @Roles(Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async unfeaturePropertyController(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.unfeatureProperty(id, user.id, user.role);
  }

  /**
   * @PUT     /properties/:id/status
   * @desc    የቤት ሁኔታ መቀየር
   * @access  LANDLORD (የራሱን), BROKER (የሚያስተዳድረውን), KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Put(':id/status')
  @Roles(Role.LANDLORD, Role.BROKER, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async changePropertyStatusController(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.changePropertyStatus(id, status as any, user.id, user.role);
  }

  // ==================== የቤት ጥያቄዎች ኤንድፖይንቶች ====================

  /**
   * @POST    /properties/:propertyId/inquiries
   * @desc    አዲስ ጥያቄ መፍጠር
   * @access  ሁሉም (Public - እንግዳም መጠየቅ ይችላል)
   */
  @Public()
  @Post(':propertyId/inquiries')
  @HttpCode(HttpStatus.CREATED)
  async createInquiryController(
    @Param('propertyId') propertyId: string,
    @Body() createInquiryDto: CreatePropertyInquiryDto,
    @CurrentUser() user: any,
  ): Promise<PropertyInquiryResponseDto> {
    createInquiryDto.propertyId = propertyId;
    return this.propertyUseCase.createInquiry(
      createInquiryDto,
      user?.id,
    );
  }

  /**
   * @GET     /properties/inquiries/my
   * @desc    የተጠቃሚውን ጥያቄዎች ማግኘት
   * @access  ተመዝጋቢ ሁሉ
   */
  @Get('inquiries/my')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getMyInquiriesController(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.propertyUseCase.getUserInquiries(user.id, page, limit);
  }

  /**
   * @GET     /properties/:propertyId/inquiries
   * @desc    የአንድ ቤት ጥያቄዎችን ማግኘት
   * @access  LANDLORD (የራሱን), BROKER (የሚያስተዳድረውን), KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Get(':propertyId/inquiries')
  @Roles(Role.LANDLORD, Role.BROKER, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getPropertyInquiriesController(
    @Param('propertyId') propertyId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    // ይሄ በUseCase ውስጥ መጨመር አለበት
    // ለአሁን ባዶ እንመልሳለን
    return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
  }

  /**
   * @GET     /properties/inquiries/pending
   * @desc    ምላሽ ያልተሰጣቸው ጥያቄዎችን ማግኘት
   * @access  LANDLORD, BROKER, KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Get('inquiries/pending')
  @Roles(Role.LANDLORD, Role.BROKER, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getPendingInquiriesController(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.propertyUseCase.getPendingInquiries(page, limit);
  }

  /**
   * @POST    /properties/inquiries/:inquiryId/respond
   * @desc    ለጥያቄ ምላሽ መስጠት
   * @access  LANDLORD (የራሱን), BROKER (የሚያስተዳድረውን), SUPER_ADMIN
   */
  @Post('inquiries/:inquiryId/respond')
  @Roles(Role.LANDLORD, Role.BROKER, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async respondToInquiryController(
    @Param('inquiryId') inquiryId: string,
    @Body('response') response: string,
    @CurrentUser() user: any,
  ): Promise<PropertyInquiryResponseDto> {
    return this.propertyUseCase.respondToInquiry(
      inquiryId,
      response,
      user.id,
      user.role,
    );
  }

  // ==================== ተወዳጅ ቤቶች ኤንድፖይንቶች ====================

  /**
   * @POST    /properties/:propertyId/favorite
   * @desc    ቤት መውደድ
   * @access  ተመዝጋቢ ሁሉ
   */
  @Post(':propertyId/favorite')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async addFavoriteController(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    await this.propertyUseCase.addFavorite(user.id, propertyId);
    return { message: 'ቤት በተሳካ ሁኔታ ተወደደ' };
  }

  /**
   * @DELETE  /properties/:propertyId/favorite
   * @desc    ቤት መውደድን ማስወገድ
   * @access  ተመዝጋቢ ሁሉ
   */
  @Delete(':propertyId/favorite')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeFavoriteController(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    await this.propertyUseCase.removeFavorite(user.id, propertyId);
    return { message: 'ቤት ከመወደድ ተወግዷል' };
  }

  /**
   * @GET     /properties/:propertyId/is-favorite
   * @desc    ተጠቃሚ ቤቱን ወዶ መሆኑን ማረጋገጥ
   * @access  ተመዝጋቢ ሁሉ
   */
  @Get(':propertyId/is-favorite')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async checkIsFavoriteController(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: any,
  ): Promise<{ isFavorite: boolean }> {
    return this.propertyUseCase.checkIsFavorite(user.id, propertyId);
  }

  /**
   * @GET     /favorites/my
   * @desc    ተጠቃሚ የወደዳቸውን ቤቶች ማግኘት
   * @access  ተመዝጋቢ ሁሉ
   */
  @Get('favorites/my')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getMyFavoritesController(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.propertyUseCase.getUserFavorites(user.id, page, limit);
  }
}