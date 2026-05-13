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
  ParseIntPipe,
  DefaultValuePipe,
  Optional,
} from '@nestjs/common';
import { PropertyUseCase } from '../../application/use-cases/property.use-case';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Role } from '../../../common/constants/roles.enum';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CreatePropertyDto } from '../../application/dtos/create-property.dto';
import { UpdatePropertyDto } from '../../application/dtos/update-property.dto';
import { PropertyResponseDto, PropertyListItemDto } from '../../application/dtos/property-response.dto';
import { PropertySearchDto, PropertySearchResponseDto } from '../../application/dtos/property-search.dto';
import { CreatePropertyInquiryDto, PropertyInquiryResponseDto } from '../../application/dtos/property-inquiry.dto';

@Controller('properties')
@UseGuards(AuthGuard, RolesGuard)
export class PropertyController {
  constructor(private readonly propertyUseCase: PropertyUseCase) {}

  // ==================== PUBLIC BROWSE ENDPOINTS ====================

  /**
   * @GET     /properties
   * @desc    Browse all active listings — no auth required
   * @access  Public
   */
  @Public()
  @Get()
  async getAllPropertiesController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getAllProperties(page, limit);
  }

  /**
   * @GET     /properties/search
   * @desc    Search/filter listings — no auth required
   * @access  Public
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
   * @desc    Featured listings for homepage — no auth required
   * @access  Public
   */
  @Public()
  @Get('featured')
  async getFeaturedPropertiesController(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PropertyListItemDto[]> {
    return this.propertyUseCase.getFeaturedProperties(limit);
  }

  /**
   * @GET     /properties/most-viewed
   * @desc    Most viewed listings — no auth required
   * @access  Public
   */
  @Public()
  @Get('most-viewed')
  async getMostViewedPropertiesController(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PropertyListItemDto[]> {
    return this.propertyUseCase.getMostViewedProperties(limit);
  }

  /**
   * @GET     /properties/most-favorited
   * @desc    Most saved listings — no auth required
   * @access  Public
   */
  @Public()
  @Get('most-favorited')
  async getMostFavoritedPropertiesController(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PropertyListItemDto[]> {
    return this.propertyUseCase.getMostFavoritedProperties(limit);
  }

  /**
   * @GET     /properties/newest
   * @desc    Newest listings — no auth required
   * @access  Public
   */
  @Public()
  @Get('newest')
  async getNewestPropertiesController(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PropertyListItemDto[]> {
    return this.propertyUseCase.getNewestProperties(limit);
  }

  /**
   * @GET     /properties/verified
   * @desc    Kebele-verified listings — no auth required
   * @access  Public
   */
  @Public()
  @Get('verified')
  async getVerifiedPropertiesController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getVerifiedProperties(page, limit);
  }

  /**
   * @GET     /properties/landlord/:landlordId
   * @desc    All listings by a specific landlord — no auth required
   * @access  Public
   */
  @Public()
  @Get('landlord/:landlordId')
  async getPropertiesByLandlordController(
    @Param('landlordId') landlordId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getPropertiesByLandlord(landlordId, page, limit);
  }

  /**
   * @GET     /properties/broker/:brokerId
   * @desc    All listings managed by a specific broker — no auth required
   * @access  Public
   */
  @Public()
  @Get('broker/:brokerId')
  async getPropertiesByBrokerController(
    @Param('brokerId') brokerId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getPropertiesByBroker(brokerId, page, limit);
  }

  // ==================== AUTH-GATED BROWSE ====================
  // NOTE: these static-path routes MUST come before :id to avoid
  // NestJS matching 'my', 'unverified', 'favorites/my' etc. as IDs

  /**
   * @GET     /properties/my
   * @desc    Landlord/broker sees only their own listings
   * @access  LANDLORD, BROKER
   */
  @Get('my')
  @Roles(Role.LANDLORD, Role.BROKER)
  async getMyPropertiesController(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<PropertySearchResponseDto> {
    if (user.role === Role.LANDLORD) {
      return this.propertyUseCase.getPropertiesByLandlord(user.id, page, limit);
    }
    return this.propertyUseCase.getPropertiesByBroker(user.id, page, limit);
  }

  /**
   * @GET     /properties/unverified
   * @desc    Listings pending kebele verification
   * @access  KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Get('unverified')
  @Roles(Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getUnverifiedPropertiesController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<PropertySearchResponseDto> {
    return this.propertyUseCase.getUnverifiedProperties(page, limit);
  }

  /**
   * @GET     /properties/favorites/my
   * @desc    Listings the current user has saved
   * @access  All authenticated roles
   */
  @Get('favorites/my')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getMyFavoritesController(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<any> {
    return this.propertyUseCase.getUserFavorites(user.id, page, limit);
  }

  /**
   * @GET     /properties/inquiries/my
   * @desc    Inquiries sent/received by the current user
   * @access  All authenticated roles
   */
  @Get('inquiries/my')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getMyInquiriesController(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<any> {
    return this.propertyUseCase.getUserInquiries(user.id, page, limit);
  }

  /**
   * @GET     /properties/inquiries/pending
   * @desc    Unanswered inquiries queue
   * @access  LANDLORD, BROKER, KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Get('inquiries/pending')
  @Roles(Role.LANDLORD, Role.BROKER, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getPendingInquiriesController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<any> {
    return this.propertyUseCase.getPendingInquiries(page, limit);
  }

  // ==================== SINGLE PROPERTY — PUBLIC DETAIL ====================

  /**
   * @GET     /properties/:id
   * @desc    Full property detail — no auth required.
   *          View count is incremented on every call.
   *          The frontend gates the "Rent / Inquire" CTA behind login.
   * @access  Public
   */
  @Public()
  @Get(':id')
  async getPropertyByIdController(
    @Param('id') id: string,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.getPropertyById(id);
  }

  // ==================== WRITE — LANDLORD / BROKER / ADMIN ====================

  /**
   * @POST    /properties
   * @desc    Create a new listing
   * @access  LANDLORD, BROKER, SUPER_ADMIN
   */
  @Post()
  @Roles(Role.LANDLORD, Role.BROKER, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createPropertyController(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.createProperty(createPropertyDto, user.id, user.role);
  }

  /**
   * @PUT     /properties/:id
   * @desc    Edit a listing (owner / broker / admin)
   * @access  LANDLORD, BROKER, SUPER_ADMIN
   */
  @Put(':id')
  @Roles(Role.LANDLORD, Role.BROKER, Role.SUPER_ADMIN)
  async updatePropertyController(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.updateProperty(id, updatePropertyDto, user.id, user.role);
  }

  /**
   * @PUT     /properties/:id/status
   * @desc    Change listing status (available / rented / maintenance…)
   * @access  LANDLORD, BROKER, KEBELE_OFFICIAL, SUPER_ADMIN
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

  /**
   * @DELETE  /properties/:id/soft
   * @desc    Soft-delete (deactivate) a listing
   * @access  LANDLORD, BROKER, SUPER_ADMIN
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
   * @desc    Permanently remove a listing
   * @access  SUPER_ADMIN only
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

  // ==================== VERIFICATION — KEBELE / ADMIN ====================

  /**
   * @PUT     /properties/:id/verify
   * @desc    Apply kebele seal and mark verified
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
   * @desc    Renew an expiring kebele seal
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
   * @desc    Pin listing as featured (homepage / top of search)
   * @access  SUPER_ADMIN only — landlords cannot self-promote
   */
  @Put(':id/feature')
  @Roles(Role.SUPER_ADMIN)
  async featurePropertyController(
    @Param('id') id: string,
    @Body('priority') priority: number = 1,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.featureProperty(id, priority, user.id, user.role);
  }

  /**
   * @PUT     /properties/:id/unfeature
   * @desc    Remove featured status
   * @access  SUPER_ADMIN only
   */
  @Put(':id/unfeature')
  @Roles(Role.SUPER_ADMIN)
  async unfeaturePropertyController(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<PropertyResponseDto> {
    return this.propertyUseCase.unfeatureProperty(id, user.id, user.role);
  }

  // ==================== INQUIRIES ====================

  /**
   * @POST    /properties/:propertyId/inquiries
   * @desc    Send a rental inquiry.
   *          Registered users: userId attached automatically.
   *          Guests: must supply guestName + guestEmail/guestPhone.
   *          The frontend should prompt login before showing the form
   *          but the endpoint itself allows guest inquiries as a fallback.
   * @access  Public (guest) — userId enriched if session exists
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
    return this.propertyUseCase.createInquiry(createInquiryDto, user?.id);
  }

  /**
   * @GET     /properties/:propertyId/inquiries
   * @desc    All inquiries for one listing (landlord sees their own, admin sees all)
   * @access  LANDLORD, BROKER, KEBELE_OFFICIAL, SUPER_ADMIN
   */
  @Get(':propertyId/inquiries')
  @Roles(Role.LANDLORD, Role.BROKER, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async getPropertyInquiriesController(
    @Param('propertyId') propertyId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<any> {
    return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
  }

  /**
   * @POST    /properties/inquiries/:inquiryId/respond
   * @desc    Landlord / broker replies to an inquiry
   * @access  LANDLORD, BROKER, SUPER_ADMIN
   */
  @Post('inquiries/:inquiryId/respond')
  @Roles(Role.LANDLORD, Role.BROKER, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async respondToInquiryController(
    @Param('inquiryId') inquiryId: string,
    @Body('response') response: string,
    @CurrentUser() user: any,
  ): Promise<PropertyInquiryResponseDto> {
    return this.propertyUseCase.respondToInquiry(inquiryId, response, user.id, user.role);
  }

  // ==================== FAVORITES — AUTH REQUIRED ====================

  /**
   * @POST    /properties/:propertyId/favorite
   * @desc    Save a listing to favourites.
   *          Frontend redirects to /login?redirect=... if user is not logged in.
   * @access  All authenticated roles
   */
  @Post(':propertyId/favorite')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async addFavoriteController(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    await this.propertyUseCase.addFavorite(user.id, propertyId);
    return { message: 'Property saved to favourites.' };
  }

  /**
   * @DELETE  /properties/:propertyId/favorite
   * @desc    Remove a listing from favourites
   * @access  All authenticated roles
   */
  @Delete(':propertyId/favorite')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeFavoriteController(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    await this.propertyUseCase.removeFavorite(user.id, propertyId);
    return { message: 'Property removed from favourites.' };
  }

  /**
   * @GET     /properties/:propertyId/is-favorite
   * @desc    Check if the current user has saved a listing.
   *          Returns { isFavorite: false } for unauthenticated callers
   *          so the frontend heart icon works without forcing login.
   * @access  All authenticated roles
   */
  @Get(':propertyId/is-favorite')
  @Roles(Role.LANDLORD, Role.BROKER, Role.TENANT, Role.KEBELE_OFFICIAL, Role.SUPER_ADMIN)
  async checkIsFavoriteController(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: any,
  ): Promise<{ isFavorite: boolean }> {
    return this.propertyUseCase.checkIsFavorite(user.id, propertyId);
  }
}