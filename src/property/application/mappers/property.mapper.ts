import { Injectable } from '@nestjs/common';
import { PropertyEntity } from '../../domain/entities/property.entity';
import { PropertyImageEntity } from '../../domain/entities/property-image.entity';
import { PropertyFeatureEntity } from '../../domain/entities/property-feature.entity';
import { PropertyInquiryEntity } from '../../domain/entities/property-inquiry.entity';
import { FavoriteEntity } from '../../domain/entities/favorite.entity';

import {
  CreatePropertyDto,
  PropertyImageDto,
  PropertyFeatureDto,
} from '../dtos/create-property.dto';
import { UpdatePropertyDto } from '../dtos/update-property.dto';
import {
  PropertyResponseDto,
  PropertyImageResponseDto,
  PropertyFeatureResponseDto,
  LandlordInfoDto,
  BrokerInfoDto,
  LocationHierarchyDto,
} from '../dtos/property-response.dto';
import { PropertyInquiryResponseDto } from '../dtos/property-inquiry.dto';

@Injectable()
export class PropertyMapper {
  // ==================== ወደ Property Entity መቀየር ====================

  toPropertyEntityFromCreate(dto: CreatePropertyDto): Partial<PropertyEntity> {
    return {
      title: dto.title,
      description: dto.description,
      propertyType: dto.propertyType,
      status: dto.status,

      bedrooms: dto.bedrooms ?? 1,
      bathrooms: dto.bathrooms ?? 1,
      area: dto.area,
      floor: dto.floor,
      totalFloors: dto.totalFloors,

      hasFurniture: dto.hasFurniture ?? false,
      hasParking: dto.hasParking ?? false,
      hasElevator: dto.hasElevator ?? false,
      hasBalcony: dto.hasBalcony ?? false,
      hasGarden: dto.hasGarden ?? false,
      hasSecurity: dto.hasSecurity ?? false,
      hasBackupGenerator: dto.hasBackupGenerator ?? false,
      hasWaterTank: dto.hasWaterTank ?? false,

      monthlyRent: dto.monthlyRent,
      securityDeposit: dto.securityDeposit ?? 0,
      minimumLeaseMonths: dto.minimumLeaseMonths ?? 6,
      isNegotiable: dto.isNegotiable ?? false,

      regionId: dto.regionId,
      zoneId: dto.zoneId,
      cityId: dto.cityId,
      subcityId: dto.subcityId,
      woredaId: dto.woredaId,
      kebeleId: dto.kebeleId,
      houseNumber: dto.houseNumber,
      streetName: dto.streetName,
      landmark: dto.landmark,
      latitude: dto.latitude,
      longitude: dto.longitude,
      googleMapsUrl: dto.googleMapsUrl,

      landlordId: dto.landlordId,
      brokerId: dto.brokerId,

      availableFrom: dto.availableFrom,
      isActive: dto.isActive ?? true,
      featured: dto.featured ?? false,
      priority: dto.priority ?? 0,

      // መነሻ እሴቶች
      isVerified: false,
      viewCount: 0,
      favoriteCount: 0,
      inquiryCount: 0,
    };
  }

  toPropertyEntityFromUpdate(dto: UpdatePropertyDto): Partial<PropertyEntity> {
    const entity: Partial<PropertyEntity> = {};

    if (dto.title !== undefined) entity.title = dto.title;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.propertyType !== undefined) entity.propertyType = dto.propertyType;
    if (dto.status !== undefined) entity.status = dto.status;

    if (dto.bedrooms !== undefined) entity.bedrooms = dto.bedrooms;
    if (dto.bathrooms !== undefined) entity.bathrooms = dto.bathrooms;
    if (dto.area !== undefined) entity.area = dto.area;
    if (dto.floor !== undefined) entity.floor = dto.floor;
    if (dto.totalFloors !== undefined) entity.totalFloors = dto.totalFloors;

    if (dto.hasFurniture !== undefined) entity.hasFurniture = dto.hasFurniture;
    if (dto.hasParking !== undefined) entity.hasParking = dto.hasParking;
    if (dto.hasElevator !== undefined) entity.hasElevator = dto.hasElevator;
    if (dto.hasBalcony !== undefined) entity.hasBalcony = dto.hasBalcony;
    if (dto.hasGarden !== undefined) entity.hasGarden = dto.hasGarden;
    if (dto.hasSecurity !== undefined) entity.hasSecurity = dto.hasSecurity;
    if (dto.hasBackupGenerator !== undefined)
      entity.hasBackupGenerator = dto.hasBackupGenerator;
    if (dto.hasWaterTank !== undefined) entity.hasWaterTank = dto.hasWaterTank;

    if (dto.monthlyRent !== undefined) entity.monthlyRent = dto.monthlyRent;
    if (dto.securityDeposit !== undefined)
      entity.securityDeposit = dto.securityDeposit;
    if (dto.minimumLeaseMonths !== undefined)
      entity.minimumLeaseMonths = dto.minimumLeaseMonths;
    if (dto.isNegotiable !== undefined) entity.isNegotiable = dto.isNegotiable;

    if (dto.regionId !== undefined) entity.regionId = dto.regionId;
    if (dto.zoneId !== undefined) entity.zoneId = dto.zoneId;
    if (dto.cityId !== undefined) entity.cityId = dto.cityId;
    if (dto.subcityId !== undefined) entity.subcityId = dto.subcityId;
    if (dto.woredaId !== undefined) entity.woredaId = dto.woredaId;
    if (dto.kebeleId !== undefined) entity.kebeleId = dto.kebeleId;
    if (dto.houseNumber !== undefined) entity.houseNumber = dto.houseNumber;
    if (dto.streetName !== undefined) entity.streetName = dto.streetName;
    if (dto.landmark !== undefined) entity.landmark = dto.landmark;
    if (dto.latitude !== undefined) entity.latitude = dto.latitude;
    if (dto.longitude !== undefined) entity.longitude = dto.longitude;
    if (dto.googleMapsUrl !== undefined)
      entity.googleMapsUrl = dto.googleMapsUrl;

    if (dto.landlordId !== undefined) entity.landlordId = dto.landlordId;
    if (dto.brokerId !== undefined) entity.brokerId = dto.brokerId;

    if (dto.availableFrom !== undefined)
      entity.availableFrom = dto.availableFrom;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.featured !== undefined) entity.featured = dto.featured;
    if (dto.priority !== undefined) entity.priority = dto.priority;

    return entity;
  }

  // ==================== ከProperty Entity ወደ Response DTO መቀየር ====================

  toPropertyResponseDto(
    entity: PropertyEntity,
    locationNames?: {
      regionName?: string;
      zoneName?: string;
      cityName?: string;
      subcityName?: string;
      woredaName?: string;
      kebeleName?: string;
    },
    landlordInfo?: {
      name: string;
      phone: string;
      email?: string;
      isVerified: boolean;
    },
    brokerInfo?: { name: string; phone: string; email?: string },
  ): PropertyResponseDto {
    // የአካባቢ ተዋረድ ማዘጋጀት
    const location: LocationHierarchyDto = {
      regionId: entity.regionId,
      regionName: locationNames?.regionName,
      zoneId: entity.zoneId || undefined,
      zoneName: locationNames?.zoneName,
      cityId: entity.cityId || undefined,
      cityName: locationNames?.cityName,
      subcityId: entity.subcityId || undefined,
      subcityName: locationNames?.subcityName,
      woredaId: entity.woredaId || undefined,
      woredaName: locationNames?.woredaName,
      kebeleId: entity.kebeleId || undefined,
      kebeleName: locationNames?.kebeleName,
      houseNumber: entity.houseNumber || undefined,
      streetName: entity.streetName || undefined,
      landmark: entity.landmark || undefined,
      latitude: entity.latitude || undefined,
      longitude: entity.longitude || undefined,
      fullAddress: entity.fullAddress || undefined,
    };

    // የባለቤት መረጃ ማዘጋጀት
    const landlord: LandlordInfoDto = landlordInfo
      ? {
          id: entity.landlordId,
          name: landlordInfo.name,
          phone: landlordInfo.phone,
          email: landlordInfo.email,
          isVerified: landlordInfo.isVerified,
        }
      : {
          id: entity.landlordId,
          name: '',
          phone: '',
          isVerified: false,
        };

    // የደላላ መረጃ ማዘጋጀት (ካለ)
    const broker =
      brokerInfo && entity.brokerId
        ? {
            id: entity.brokerId,
            name: brokerInfo.name,
            phone: brokerInfo.phone,
            email: brokerInfo.email,
          }
        : undefined;

    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      propertyType: entity.propertyType,
      status: entity.status,

      bedrooms: entity.bedrooms,
      bathrooms: entity.bathrooms,
      area: entity.area,
      floor: entity.floor || undefined,
      totalFloors: entity.totalFloors || undefined,

      hasFurniture: entity.hasFurniture,
      hasParking: entity.hasParking,
      hasElevator: entity.hasElevator,
      hasBalcony: entity.hasBalcony,
      hasGarden: entity.hasGarden,
      hasSecurity: entity.hasSecurity,
      hasBackupGenerator: entity.hasBackupGenerator,
      hasWaterTank: entity.hasWaterTank,

      monthlyRent: entity.monthlyRent,
      securityDeposit: entity.securityDeposit,
      minimumLeaseMonths: entity.minimumLeaseMonths,
      isNegotiable: entity.isNegotiable,

      location,

      isVerified: entity.isVerified,
      verifiedBy: entity.verifiedBy || undefined,
      verifiedAt: entity.verifiedAt || undefined,
      hasKebeleSeal: !!entity.kebeleSeal,

      landlord,
      broker,

      images: entity.images
        ? this.toPropertyImageResponseDtoList(entity.images)
        : [],
      features: entity.features
        ? this.toPropertyFeatureResponseDtoList(entity.features)
        : [],

      viewCount: entity.viewCount,
      favoriteCount: entity.favoriteCount,
      inquiryCount: entity.inquiryCount,

      availableFrom: entity.availableFrom || undefined,
      isActive: entity.isActive,
      featured: entity.featured,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toPropertyResponseDtoList(
    entities: PropertyEntity[],
    locationNamesMap?: Map<
      string,
      {
        regionName?: string;
        zoneName?: string;
        cityName?: string;
        subcityName?: string;
        woredaName?: string;
        kebeleName?: string;
      }
    >,
    landlordInfoMap?: Map<
      string,
      { name: string; phone: string; email?: string; isVerified: boolean }
    >,
    brokerInfoMap?: Map<
      string,
      { name: string; phone: string; email?: string }
    >,
  ): PropertyResponseDto[] {
    return entities.map((entity) =>
      this.toPropertyResponseDto(
        entity,
        locationNamesMap?.get(entity.id),
        landlordInfoMap?.get(entity.landlordId),
        entity.brokerId ? brokerInfoMap?.get(entity.brokerId) : undefined,
      ),
    );
  }

  // ==================== የፎቶ መቀየሪያ ዘዴዎች ====================

  toPropertyImageEntityFromDto(
    propertyId: string,
    dto: PropertyImageDto,
  ): Partial<PropertyImageEntity> {
    return {
      propertyId,
      url: dto.url,
      thumbnailUrl: dto.thumbnailUrl,
      caption: dto.caption,
      isPrimary: dto.isPrimary ?? false,
      order: dto.order ?? 0,
    };
  }

  toPropertyImageResponseDto(
    entity: PropertyImageEntity,
  ): PropertyImageResponseDto {
    return {
      id: entity.id,
      //   propertyId: entity.propertyId,
      url: entity.url,
      thumbnailUrl: entity.thumbnailUrl || undefined,
      caption: entity.caption || undefined,
      isPrimary: entity.isPrimary,
      order: entity.order,
      createdAt: entity.createdAt,
    };
  }

  toPropertyImageResponseDtoList(
    entities: PropertyImageEntity[],
  ): PropertyImageResponseDto[] {
    return entities
      .sort((a, b) => a.order - b.order)
      .map((entity) => this.toPropertyImageResponseDto(entity));
  }

  // ==================== የባህሪ መቀየሪያ ዘዴዎች ====================

  toPropertyFeatureEntityFromDto(
    propertyId: string,
    dto: PropertyFeatureDto,
  ): Partial<PropertyFeatureEntity> {
    return {
      propertyId,
      name: dto.name,
      category: dto.category,
    };
  }

  toPropertyFeatureResponseDto(
    entity: PropertyFeatureEntity,
  ): PropertyFeatureResponseDto {
    return {
      id: entity.id,
      //   propertyId: entity.propertyId,
      name: entity.name,
      category: entity.category || undefined,
      createdAt: entity.createdAt,
    };
  }

  toPropertyFeatureResponseDtoList(
    entities: PropertyFeatureEntity[],
  ): PropertyFeatureResponseDto[] {
    return entities.map((entity) => this.toPropertyFeatureResponseDto(entity));
  }

  // ==================== የጥያቄ መቀየሪያ ዘዴዎች ====================

  toPropertyInquiryResponseDto(
    entity: PropertyInquiryEntity,
    propertyTitle?: string,
    userName?: string,
    userEmail?: string,
    userPhone?: string,
  ): PropertyInquiryResponseDto {
    return {
      id: entity.id,
      propertyId: entity.propertyId,
      propertyTitle,

      userId: entity.userId || undefined,
      userName: userName,
      userEmail: userEmail,
      userPhone: userPhone,

      guestName: entity.guestName || undefined,
      guestEmail: entity.guestEmail || undefined,
      guestPhone: entity.guestPhone || undefined,

      message: entity.message,
      status: entity.status,

      response: entity.response || undefined,
      respondedBy: entity.respondedBy || undefined,
      respondedAt: entity.respondedAt || undefined,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toPropertyInquiryResponseDtoList(
    entities: PropertyInquiryEntity[],
    propertyTitlesMap?: Map<string, string>,
    userNamesMap?: Map<string, string>,
    userEmailsMap?: Map<string, string>,
    userPhonesMap?: Map<string, string>,
  ): PropertyInquiryResponseDto[] {
    return entities.map((entity) =>
      this.toPropertyInquiryResponseDto(
        entity,
        propertyTitlesMap?.get(entity.propertyId),
        entity.userId ? userNamesMap?.get(entity.userId) : undefined,
        entity.userId ? userEmailsMap?.get(entity.userId) : undefined,
        entity.userId ? userPhonesMap?.get(entity.userId) : undefined,
      ),
    );
  }

  // ==================== የተወዳጅ መቀየሪያ ዘዴዎች ====================

  toFavoriteResponseDto(
    entity: FavoriteEntity,
    propertyTitle?: string,
    userName?: string,
  ): any {
    return {
      id: entity.id,
      userId: entity.userId,
      userName,
      propertyId: entity.propertyId,
      propertyTitle,
      createdAt: entity.createdAt,
    };
  }

  toFavoriteResponseDtoList(
    entities: FavoriteEntity[],
    propertyTitlesMap?: Map<string, string>,
    userNamesMap?: Map<string, string>,
  ): any[] {
    return entities.map((entity) =>
      this.toFavoriteResponseDto(
        entity,
        propertyTitlesMap?.get(entity.propertyId),
        userNamesMap?.get(entity.userId),
      ),
    );
  }

  // ==================== ሌሎች ረዳት ዘዴዎች ====================

  // ከፍለጋ መስፈርቶች የሚገኘውን ውሂብ ለማዘጋጀት
  prepareSearchFilters(filters: any): any {
    const preparedFilters: any = {};

    if (filters.keyword) preparedFilters.keyword = filters.keyword;
    if (filters.regionId) preparedFilters.regionId = filters.regionId;
    if (filters.zoneId) preparedFilters.zoneId = filters.zoneId;
    if (filters.cityId) preparedFilters.cityId = filters.cityId;
    if (filters.subcityId) preparedFilters.subcityId = filters.subcityId;
    if (filters.woredaId) preparedFilters.woredaId = filters.woredaId;
    if (filters.kebeleId) preparedFilters.kebeleId = filters.kebeleId;

    if (filters.minPrice !== undefined)
      preparedFilters.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined)
      preparedFilters.maxPrice = filters.maxPrice;

    if (filters.bedrooms !== undefined)
      preparedFilters.bedrooms = filters.bedrooms;
    if (filters.bathrooms !== undefined)
      preparedFilters.bathrooms = filters.bathrooms;
    if (filters.minArea !== undefined)
      preparedFilters.minArea = filters.minArea;
    if (filters.maxArea !== undefined)
      preparedFilters.maxArea = filters.maxArea;

    if (filters.propertyType)
      preparedFilters.propertyType = filters.propertyType;
    if (filters.status) preparedFilters.status = filters.status;

    if (filters.hasFurniture !== undefined)
      preparedFilters.hasFurniture = filters.hasFurniture;
    if (filters.hasParking !== undefined)
      preparedFilters.hasParking = filters.hasParking;
    if (filters.hasElevator !== undefined)
      preparedFilters.hasElevator = filters.hasElevator;
    if (filters.hasBalcony !== undefined)
      preparedFilters.hasBalcony = filters.hasBalcony;
    if (filters.hasGarden !== undefined)
      preparedFilters.hasGarden = filters.hasGarden;
    if (filters.hasSecurity !== undefined)
      preparedFilters.hasSecurity = filters.hasSecurity;

    if (filters.isVerified !== undefined)
      preparedFilters.isVerified = filters.isVerified;
    if (filters.featured !== undefined)
      preparedFilters.featured = filters.featured;

    preparedFilters.skip = filters.skip || 0;
    preparedFilters.take = filters.take || 10;
    preparedFilters.sortBy = filters.sortBy || 'createdAt';
    preparedFilters.sortOrder = filters.sortOrder || 'desc';

    return preparedFilters;
  }

  // የፍለጋ ውጤት ማዘጋጀት
  prepareSearchResponse(
    data: PropertyEntity[],
    total: number,
    page: number,
    limit: number,
  ): any {
    const totalPages = Math.ceil(total / limit);

    return {
      data: this.toPropertyResponseDtoList(data),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }
}
