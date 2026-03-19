import { Injectable, NotFoundException, ConflictException, ForbiddenException, Inject } from '@nestjs/common';
import type { IPropertyRepository } from '../../domain/ports/repositories/property.repository.interface';
import { PropertyMapper } from '../mappers/property.mapper';
import { PropertyEntity } from '../../domain/entities/property.entity';
import { PropertyType, PropertyStatus } from '@prisma/client';

// DTOs
import { CreatePropertyDto, PropertyImageDto, PropertyFeatureDto } from '../dtos/create-property.dto';
import { UpdatePropertyDto } from '../dtos/update-property.dto';
import { PropertyResponseDto, PropertyListItemDto } from '../dtos/property-response.dto';
import { PropertySearchDto, PropertySearchResponseDto } from '../dtos/property-search.dto';
import { CreatePropertyInquiryDto, PropertyInquiryResponseDto } from '../dtos/property-inquiry.dto';

@Injectable()
export class PropertyUseCase {
  constructor(
    @Inject('IPropertyRepository')
    private readonly propertyRepository: IPropertyRepository,
    private readonly propertyMapper: PropertyMapper,
  ) {}

  // ==================== ዋና የቤት ማስተዳደር ዘዴዎች ====================

  /**
   * አዲስ ቤት መፍጠር
   */
  async createProperty(createPropertyDto: CreatePropertyDto, userId: string, userRole: string): Promise<PropertyResponseDto> {
    // ፈቃድ ማረጋገጥ - LANDLORD ወይም BROKER ብቻ
    if (!['LANDLORD', 'BROKER', 'SUPER_ADMIN'].includes(userRole)) {
      throw new ForbiddenException('ቤት ለመመዝገብ አከራይ ወይም ደላላ መሆን አለብህ');
    }

    // ባለቤቱ ራሱ እየመዘገበ ከሆነ
    if (userRole === 'LANDLORD') {
      createPropertyDto.landlordId = userId;
    }

    // ደላላ እየመዘገበ ከሆነ
    if (userRole === 'BROKER') {
      createPropertyDto.brokerId = userId;
    }

    // ቤቱ በርዕስ አስቀድሞ መኖሩን አረጋግጥ
    const existingProperty = await this.propertyRepository.getPropertyByTitle(createPropertyDto.title);
    if (existingProperty) {
      throw new ConflictException(`ቤት '${createPropertyDto.title}' አስቀድሞ ተመዝግቧል`);
    }

    const propertyEntity = this.propertyMapper.toPropertyEntityFromCreate(createPropertyDto);
    const newProperty = await this.propertyRepository.createProperty(propertyEntity);

    // ፎቶዎች ካሉ ጨምር
    if (createPropertyDto.images && createPropertyDto.images.length > 0) {
      for (const imageDto of createPropertyDto.images) {
        const imageEntity = this.propertyMapper.toPropertyImageEntityFromDto(newProperty.id, imageDto);
        await this.propertyRepository.addPropertyImage(newProperty.id, imageEntity);
      }
    }

    // ባህሪያት ካሉ ጨምር
    if (createPropertyDto.features && createPropertyDto.features.length > 0) {
      for (const featureDto of createPropertyDto.features) {
        const featureEntity = this.propertyMapper.toPropertyFeatureEntityFromDto(newProperty.id, featureDto);
        await this.propertyRepository.addPropertyFeature(newProperty.id, featureEntity);
      }
    }

    // የተፈጠረውን ቤት ከሙሉ መረጃ ጋር መልስ
    return this.getPropertyById(newProperty.id);
  }

  /**
   * ቤት በID ማግኘት
   */
  async getPropertyById(id: string): Promise<PropertyResponseDto> {
    const property = await this.propertyRepository.getPropertyById(id);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${id}' አልተገኘም`);
    }

    // እይታ ቆጠራን ጨምር
    await this.propertyRepository.incrementPropertyViewCount(id);

    // የአካባቢ ስሞችን ለማግኘት (በኋላ ላይ ከሌላ አገልግሎት ልናገኝ እንችላለን)
    const locationNames = await this.getLocationNames(property);
    
    // የባለቤት መረጃ ለማግኘት (በኋላ ላይ ከUserModule ልናገኝ እንችላለን)
    const landlordInfo = await this.getLandlordInfo(property.landlordId);
    
    // የደላላ መረጃ ለማግኘት (ካለ)
    const brokerInfo = property.brokerId ? await this.getBrokerInfo(property.brokerId) : undefined;

    return this.propertyMapper.toPropertyResponseDto(
      property,
      locationNames,
      landlordInfo,
      brokerInfo
    );
  }

  /**
   * ሁሉንም ቤቶች ማግኘት
   */
  async getAllProperties(page: number = 1, limit: number = 10): Promise<PropertySearchResponseDto> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.propertyRepository.getAllProperties(skip, limit, 'createdAt', 'desc');

    const propertyDtos = await this.enrichPropertiesWithNames(data);

    return this.propertyMapper.prepareSearchResponse(propertyDtos, total, page, limit);
  }

  /**
   * በባለቤት የሚገኙ ቤቶችን ማግኘት
   */
  async getPropertiesByLandlord(
    landlordId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PropertySearchResponseDto> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.propertyRepository.getPropertiesByLandlord(landlordId, skip, limit);

    const propertyDtos = await this.enrichPropertiesWithNames(data);

    return this.propertyMapper.prepareSearchResponse(propertyDtos, total, page, limit);
  }

  /**
   * በደላላ የሚተዳደሩ ቤቶችን ማግኘት
   */
  async getPropertiesByBroker(
    brokerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PropertySearchResponseDto> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.propertyRepository.getPropertiesByBroker(brokerId, skip, limit);

    const propertyDtos = await this.enrichPropertiesWithNames(data);

    return this.propertyMapper.prepareSearchResponse(propertyDtos, total, page, limit);
  }

  /**
   * ቤት ማዘመን
   */
  async updateProperty(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    userId: string,
    userRole: string
  ): Promise<PropertyResponseDto> {
    const property = await this.propertyRepository.getPropertyById(id);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${id}' አልተገኘም`);
    }

    // ፈቃድ ማረጋገጥ
    this.checkPropertyPermission(property, userId, userRole);

    // ርዕስ እየተቀየረ ከሆነ አዲሱ ርዕስ አስቀድሞ አለመኖሩን አረጋግጥ
    if (updatePropertyDto.title && updatePropertyDto.title !== property.title) {
      const existingProperty = await this.propertyRepository.getPropertyByTitle(updatePropertyDto.title);
      if (existingProperty && existingProperty.id !== id) {
        throw new ConflictException(`ቤት '${updatePropertyDto.title}' አስቀድሞ ተመዝግቧል`);
      }
    }

    const propertyEntity = this.propertyMapper.toPropertyEntityFromUpdate(updatePropertyDto);
    const updatedProperty = await this.propertyRepository.updateProperty(id, propertyEntity);

    // ፎቶዎች ማስተዳደር
    if (updatePropertyDto.images) {
      await this.handleImageUpdates(id, updatePropertyDto.images, updatePropertyDto.imagesToDelete);
    }

    // ባህሪያት ማስተዳደር
    if (updatePropertyDto.features) {
      await this.handleFeatureUpdates(id, updatePropertyDto.features);
    }

    return this.getPropertyById(id);
  }

  /**
   * ቤት መሰረዝ (ለስላሳ ሰርዝ)
   */
  async softDeleteProperty(id: string, userId: string, userRole: string): Promise<PropertyResponseDto> {
    const property = await this.propertyRepository.getPropertyById(id);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${id}' አልተገኘም`);
    }

    // ፈቃድ ማረጋገጥ
    this.checkPropertyPermission(property, userId, userRole);

    const deletedProperty = await this.propertyRepository.softDeleteProperty(id);
    return this.getPropertyById(deletedProperty.id);
  }

  /**
   * ቤት ሙሉ በሙሉ መሰረዝ (ለሱፐር አድሚን ብቻ)
   */
  async hardDeleteProperty(id: string, userRole: string): Promise<void> {
    if (userRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('ቤትን ሙሉ በሙሉ ለመሰረዝ ሱፐር አድሚን መሆን አለብህ');
    }

    const propertyExists = await this.propertyRepository.propertyExists(id);
    if (!propertyExists) {
      throw new NotFoundException(`ቤት በID '${id}' አልተገኘም`);
    }

    await this.propertyRepository.hardDeleteProperty(id);
  }

  // ==================== የቤት ፍለጋ እና ማጣሪያ ====================

  /**
   * ቤቶችን መፈለግ
   */
  async searchProperties(searchDto: PropertySearchDto): Promise<PropertySearchResponseDto> {
    const filters = this.propertyMapper.prepareSearchFilters(searchDto);
    const { data, total } = await this.propertyRepository.searchProperties(filters);

    const propertyDtos = await this.enrichPropertiesWithNames(data);

    return this.propertyMapper.prepareSearchResponse(
      propertyDtos,
      total,
      searchDto.page || 1,
      searchDto.limit || 10
    );
  }

  /**
   * የተረጋገጡ ቤቶችን ማግኘት
   */
  async getVerifiedProperties(page: number = 1, limit: number = 10): Promise<PropertySearchResponseDto> {
    const filters = { isVerified: true, skip: (page - 1) * limit, take: limit };
    const { data, total } = await this.propertyRepository.searchProperties(filters);

    const propertyDtos = await this.enrichPropertiesWithNames(data);

    return this.propertyMapper.prepareSearchResponse(propertyDtos, total, page, limit);
  }

  /**
   * ያልተረጋገጡ ቤቶችን ማግኘት (ለቀበሌ)
   */
  async getUnverifiedProperties(page: number = 1, limit: number = 10): Promise<PropertySearchResponseDto> {
    const filters = { isVerified: false, skip: (page - 1) * limit, take: limit };
    const { data, total } = await this.propertyRepository.searchProperties(filters);

    const propertyDtos = await this.enrichPropertiesWithNames(data);

    return this.propertyMapper.prepareSearchResponse(propertyDtos, total, page, limit);
  }

  /**
   * ተለይተው የሚታዩ ቤቶችን ማግኘት
   */
  async getFeaturedProperties(limit: number = 10): Promise<PropertyListItemDto[]> {
    const properties = await this.propertyRepository.getFeaturedProperties(limit);
    const propertyDtos = await this.enrichPropertiesWithNames(properties);
    
    // ወደ አጭር ዝርዝር መቀየር
    return propertyDtos.map(p => this.toListItemDto(p));
  }

  /**
   * በጣም የታዩ ቤቶችን ማግኘት
   */
  async getMostViewedProperties(limit: number = 10): Promise<PropertyListItemDto[]> {
    const properties = await this.propertyRepository.getMostViewedProperties(limit);
    const propertyDtos = await this.enrichPropertiesWithNames(properties);
    
    return propertyDtos.map(p => this.toListItemDto(p));
  }

  /**
   * በጣም የተወደዱ ቤቶችን ማግኘት
   */
  async getMostFavoritedProperties(limit: number = 10): Promise<PropertyListItemDto[]> {
    const properties = await this.propertyRepository.getMostFavoritedProperties(limit);
    const propertyDtos = await this.enrichPropertiesWithNames(properties);
    
    return propertyDtos.map(p => this.toListItemDto(p));
  }

  /**
   * አዳዲስ ቤቶችን ማግኘት
   */
  async getNewestProperties(limit: number = 10): Promise<PropertyListItemDto[]> {
    const filters = { skip: 0, take: limit, sortBy: 'createdAt', sortOrder: 'desc' as const };
    const { data } = await this.propertyRepository.searchProperties(filters);
    
    const propertyDtos = await this.enrichPropertiesWithNames(data);
    return propertyDtos.map(p => this.toListItemDto(p));
  }

  // ==================== የቤት ማረጋገጫ ዘዴዎች ====================

  /**
   * ቤት ማረጋገጥ (ለቀበሌ ባለስልጣን)
   */
  async verifyProperty(id: string, officialId: string, seal?: string): Promise<PropertyResponseDto> {
    const property = await this.propertyRepository.getPropertyById(id);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${id}' አልተገኘም`);
    }

    if (property.isVerified) {
      throw new ConflictException('ቤቱ አስቀድሞ ተረጋግጧል');
    }

    const verifiedProperty = await this.propertyRepository.verifyProperty(id, officialId, seal);
    
    // የማረጋገጫ ታሪክ መዝግብ
    await this.propertyRepository.addVerificationHistory(id, {
      verifiedBy: officialId,
      verifiedAt: new Date(),
      sealApplied: !!seal,
      sealImage: seal,
    });

    return this.getPropertyById(id);
  }

  /**
   * የቤት ማህተም ማደስ
   */
  async renewPropertySeal(id: string, officialId: string, seal: string): Promise<PropertyResponseDto> {
    const property = await this.propertyRepository.getPropertyById(id);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${id}' አልተገኘም`);
    }

    const renewedProperty = await this.propertyRepository.renewPropertySeal(id, officialId, seal);
    
    await this.propertyRepository.addVerificationHistory(id, {
      verifiedBy: officialId,
      verifiedAt: new Date(),
      sealApplied: true,
      sealImage: seal,
      action: 'RENEWED',
    });

    return this.getPropertyById(id);
  }

  /**
   * ቤት ማሳደግ (featured)
   */
  async featureProperty(id: string, priority: number = 1, userId: string, userRole: string): Promise<PropertyResponseDto> {
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'KEBELE_OFFICIAL') {
      throw new ForbiddenException('ቤት ለማሳደግ ፈቃድ የለህም');
    }

    const property = await this.propertyRepository.getPropertyById(id);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${id}' አልተገኘም`);
    }

    const featuredProperty = await this.propertyRepository.featureProperty(id, priority);
    return this.getPropertyById(featuredProperty.id);
  }

  /**
   * ማሳደግን ማስወገድ
   */
  async unfeatureProperty(id: string, userId: string, userRole: string): Promise<PropertyResponseDto> {
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'KEBELE_OFFICIAL') {
      throw new ForbiddenException('ይህን ለማድረግ ፈቃድ የለህም');
    }

    const property = await this.propertyRepository.getPropertyById(id);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${id}' አልተገኘም`);
    }

    const unfeaturedProperty = await this.propertyRepository.unfeatureProperty(id);
    return this.getPropertyById(unfeaturedProperty.id);
  }

  /**
   * የቤት ሁኔታ መቀየር
   */
  async changePropertyStatus(
    id: string,
    status: PropertyStatus,
    userId: string,
    userRole: string
  ): Promise<PropertyResponseDto> {
    const property = await this.propertyRepository.getPropertyById(id);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${id}' አልተገኘም`);
    }

    // ባለቤት ወይም ደላላ ወይም ባለስልጣን ብቻ
    if (
      userRole !== 'SUPER_ADMIN' &&
      userRole !== 'KEBELE_OFFICIAL' &&
      property.landlordId !== userId &&
      property.brokerId !== userId
    ) {
      throw new ForbiddenException('የቤት ሁኔታ ለመቀየር ፈቃድ የለህም');
    }

    const updatedProperty = await this.propertyRepository.changePropertyStatus(id, status);
    return this.getPropertyById(updatedProperty.id);
  }

  // ==================== የቤት ጥያቄዎች አስተዳደር ====================

  /**
   * አዲስ ጥያቄ መፍጠር
   */
  async createInquiry(
    createInquiryDto: CreatePropertyInquiryDto,
    userId?: string
  ): Promise<PropertyInquiryResponseDto> {
    const property = await this.propertyRepository.getPropertyById(createInquiryDto.propertyId);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${createInquiryDto.propertyId}' አልተገኘም`);
    }

    const inquiryEntity: Partial<any> = {
      propertyId: createInquiryDto.propertyId,
      message: createInquiryDto.message,
      status: 'PENDING',
    };

    if (userId) {
      inquiryEntity.userId = userId;
    } else {
      inquiryEntity.guestName = createInquiryDto.guestName;
      inquiryEntity.guestEmail = createInquiryDto.guestEmail;
      inquiryEntity.guestPhone = createInquiryDto.guestPhone;
    }

    const newInquiry = await this.propertyRepository.createInquiry(inquiryEntity);
    
    // የቤት ጥያቄ ቆጠራ ጨምር
    await this.propertyRepository.incrementPropertyInquiryCount(property.id);

    return this.propertyMapper.toPropertyInquiryResponseDto(
      newInquiry,
      property.title
    );
  }

  /**
   * ለጥያቄ ምላሽ መስጠት
   */
  async respondToInquiry(
    id: string,
    response: string,
    responderId: string,
    userRole: string
  ): Promise<PropertyInquiryResponseDto> {
    const inquiry = await this.propertyRepository.getInquiryById(id);
    if (!inquiry) {
      throw new NotFoundException(`ጥያቄ በID '${id}' አልተገኘም`);
    }

    // የቤቱ ባለቤት ወይም ደላላ ብቻ ምላሽ መስጠት ይችላል
    const property = await this.propertyRepository.getPropertyById(inquiry.propertyId);
    if (
      userRole !== 'SUPER_ADMIN' &&
      property?.landlordId !== responderId &&
      property?.brokerId !== responderId
    ) {
      throw new ForbiddenException('ለዚህ ጥያቄ ምላሽ ለመስጠት ፈቃድ የለህም');
    }

    const updatedInquiry = await this.propertyRepository.respondToInquiry(id, response, responderId);
    
    const propertyTitle = property?.title;
    return this.propertyMapper.toPropertyInquiryResponseDto(updatedInquiry, propertyTitle);
  }

  /**
   * በተጠቃሚ የተላኩ ጥያቄዎችን ማግኘት
   */
  async getUserInquiries(userId: string, page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.propertyRepository.getInquiriesByUser(userId, skip, limit);

    // የቤት ርዕሶችን ለማግኘት
    const propertyTitlesMap = new Map<string, string>();
    for (const inquiry of data) {
      if (!propertyTitlesMap.has(inquiry.propertyId)) {
        const property = await this.propertyRepository.getPropertyById(inquiry.propertyId);
        if (property) {
          propertyTitlesMap.set(inquiry.propertyId, property.title);
        }
      }
    }

    const inquiryDtos = this.propertyMapper.toPropertyInquiryResponseDtoList(
      data,
      propertyTitlesMap
    );

    return {
      data: inquiryDtos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * ምላሽ ያልተሰጣቸው ጥያቄዎችን ማግኘት
   */
  async getPendingInquiries(page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.propertyRepository.getPendingInquiries(skip, limit);

    const propertyTitlesMap = new Map<string, string>();
    for (const inquiry of data) {
      if (!propertyTitlesMap.has(inquiry.propertyId)) {
        const property = await this.propertyRepository.getPropertyById(inquiry.propertyId);
        if (property) {
          propertyTitlesMap.set(inquiry.propertyId, property.title);
        }
      }
    }

    const inquiryDtos = this.propertyMapper.toPropertyInquiryResponseDtoList(
      data,
      propertyTitlesMap
    );

    return {
      data: inquiryDtos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== ተወዳጅ ቤቶች አስተዳደር ====================

  /**
   * ቤት መውደድ
   */
  async addFavorite(userId: string, propertyId: string): Promise<void> {
    const property = await this.propertyRepository.getPropertyById(propertyId);
    if (!property) {
      throw new NotFoundException(`ቤት በID '${propertyId}' አልተገኘም`);
    }

    const isFavorite = await this.propertyRepository.isFavorite(userId, propertyId);
    if (isFavorite) {
      throw new ConflictException('ቤቱን አስቀድመህ ወደደሃል');
    }

    await this.propertyRepository.addFavorite(userId, propertyId);
  }

  /**
   * ቤት መውደድን ማስወገድ
   */
  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    const isFavorite = await this.propertyRepository.isFavorite(userId, propertyId);
    if (!isFavorite) {
      throw new NotFoundException('ቤቱን አልወደድከውም');
    }

    await this.propertyRepository.removeFavorite(userId, propertyId);
  }

  /**
   * ተጠቃሚ የወደዳቸውን ቤቶች ማግኘት
   */
  async getUserFavorites(userId: string, page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.propertyRepository.getUserFavorites(userId, skip, limit);

    // የቤት ዝርዝሮችን ለማግኘት
    const propertyIds = data.map(f => f.propertyId);
    const properties: PropertyEntity[] = [];
    
    for (const propertyId of propertyIds) {
      const property = await this.propertyRepository.getPropertyById(propertyId);
      if (property) {
        properties.push(property);
      }
    }

    const propertyDtos = await this.enrichPropertiesWithNames(properties);

    return {
      data: propertyDtos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * ተጠቃሚ ቤቱን ወዶ መሆኑን ማረጋገጥ
   */
  async checkIsFavorite(userId: string, propertyId: string): Promise<{ isFavorite: boolean }> {
    const isFavorite = await this.propertyRepository.isFavorite(userId, propertyId);
    return { isFavorite };
  }

  // ==================== ረዳት ዘዴዎች ====================

  /**
   * ፈቃድ ማረጋገጫ
   */
  private checkPropertyPermission(
    property: PropertyEntity,
    userId: string,
    userRole: string
  ): void {
    if (userRole === 'SUPER_ADMIN') {
      return;
    }

    if (userRole === 'KEBELE_OFFICIAL') {
      // ቀበሌ ባለስልጣን ማረጋገጥ ብቻ ነው የሚችለው፣ ማረም አይችልም
      throw new ForbiddenException('ቀበሌ ባለስልጣን ቤት ማረም አይችልም');
    }

    if (property.landlordId !== userId && property.brokerId !== userId) {
      throw new ForbiddenException('ይህን ቤት ለማስተዳደር ፈቃድ የለህም');
    }
  }

  /**
   * የፎቶ ማስተካከያዎችን ማስተዳደር
   */
  private async handleImageUpdates(
    propertyId: string,
    images: PropertyImageDto[],
    imagesToDelete?: string[]
  ): Promise<void> {
    // መሰረዝ ያለባቸውን ፎቶዎች ሰርዝ
    if (imagesToDelete && imagesToDelete.length > 0) {
      for (const imageId of imagesToDelete) {
        await this.propertyRepository.deletePropertyImage(imageId);
      }
    }

    // አዳዲስ ፎቶዎችን ጨምር ወይም ያሉትን አዘምን
    for (const imageDto of images) {
      if (imageDto.id) {
        // ያለውን ፎቶ አዘምን
        const imageEntity = this.propertyMapper.toPropertyImageEntityFromDto(propertyId, imageDto);
        await this.propertyRepository.updatePropertyImage(imageDto.id, imageEntity);
      } else {
        // አዲስ ፎቶ ጨምር
        const imageEntity = this.propertyMapper.toPropertyImageEntityFromDto(propertyId, imageDto);
        await this.propertyRepository.addPropertyImage(propertyId, imageEntity);
      }
    }
  }

  /**
   * የባህሪ ማስተካከያዎችን ማስተዳደር
   */
  private async handleFeatureUpdates(
    propertyId: string,
    features: PropertyFeatureDto[]
  ): Promise<void> {
    // ቀድሞ ያሉትን ባህሪያት ሰርዝ
    await this.propertyRepository.deleteAllPropertyFeatures(propertyId);

    // አዳዲስ ባህሪያትን ጨምር
    for (const featureDto of features) {
      const featureEntity = this.propertyMapper.toPropertyFeatureEntityFromDto(propertyId, featureDto);
      await this.propertyRepository.addPropertyFeature(propertyId, featureEntity);
    }
  }

  /**
   * የቤቶችን ዝርዝር በተጨማሪ መረጃ ማበልጸግ
   */
  private async enrichPropertiesWithNames(properties: PropertyEntity[]): Promise<PropertyResponseDto[]> {
    // ይህ በኋላ ላይ ከሌሎች አገልግሎቶች መረጃ ለማምጣት ይረዳል
    const result: PropertyResponseDto[] = [];

    for (const property of properties) {
      const locationNames = await this.getLocationNames(property);
      const landlordInfo = await this.getLandlordInfo(property.landlordId);
      const brokerInfo = property.brokerId ? await this.getBrokerInfo(property.brokerId) : undefined;

      result.push(this.propertyMapper.toPropertyResponseDto(
        property,
        locationNames,
        landlordInfo,
        brokerInfo
      ));
    }

    return result;
  }

  /**
   * ወደ አጭር ዝርዝር DTO መቀየር
   */
  private toListItemDto(propertyDto: PropertyResponseDto): PropertyListItemDto {
    return {
      id: propertyDto.id,
      title: propertyDto.title,
      propertyType: propertyDto.propertyType,
      status: propertyDto.status,
      monthlyRent: propertyDto.monthlyRent,
      area: propertyDto.area,
      bedrooms: propertyDto.bedrooms,
      bathrooms: propertyDto.bathrooms,
      location: {
        regionName: propertyDto.location.regionName,
        cityName: propertyDto.location.cityName,
        subcityName: propertyDto.location.subcityName,
      },
      primaryImage: propertyDto.images.find(img => img.isPrimary) ? {
        url: propertyDto.images.find(img => img.isPrimary)!.url,
        thumbnailUrl: propertyDto.images.find(img => img.isPrimary)!.thumbnailUrl,
      } : undefined,
      isVerified: propertyDto.isVerified,
      featured: propertyDto.featured,
      createdAt: propertyDto.createdAt,
    };
  }

  /**
   * የአካባቢ ስሞችን ማግኘት (በኋላ ላይ ከLocationModule ልናገኝ እንችላለን)
   */
  private async getLocationNames(property: PropertyEntity): Promise<{
    regionName?: string;
    zoneName?: string;
    cityName?: string;
    subcityName?: string;
    woredaName?: string;
    kebeleName?: string;
  }> {
    // ይሄ ጊዜያዊ ነው - በኋላ ላይ ከLocationModule እናመጣለን
    return {};
  }

  /**
   * የባለቤት መረጃ ማግኘት (በኋላ ላይ ከUserModule ልናገኝ እንችላለን)
   */
  private async getLandlordInfo(landlordId: string): Promise<{
    id: string;
    name: string;
    phone: string;
    email?: string;
    isVerified: boolean;
  }> {
    // ይሄ ጊዜያዊ ነው - በኋላ ላይ ከUserModule እናመጣለን
    return {
      id: landlordId,
      name: '',
      phone: '',
      isVerified: false,
    };
  }

  /**
   * የደላላ መረጃ ማግኘት (በኋላ ላይ ከUserModule ልናገኝ እንችላለን)
   */
  private async getBrokerInfo(brokerId: string): Promise<{
    id: string;
    name: string;
    phone: string;
    email?: string;
  }> {
    // ይሄ ጊዜያዊ ነው - በኋላ ላይ ከUserModule እናመጣለን
    return {
      id: brokerId,
      name: '',
      phone: '',
    };
  }
}