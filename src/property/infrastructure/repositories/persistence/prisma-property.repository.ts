import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IPropertyRepository } from '../../../domain/ports/repositories/property.repository.interface';
import { PropertyEntity } from '../../../domain/entities/property.entity';
import { PropertyImageEntity } from '../../../domain/entities/property-image.entity';
import { PropertyFeatureEntity } from '../../../domain/entities/property-feature.entity';
import { PropertyInquiryEntity } from '../../../domain/entities/property-inquiry.entity';
import { FavoriteEntity } from '../../../domain/entities/favorite.entity';
import { PropertyType, PropertyStatus, InquiryStatus, Prisma } from '@prisma/client';

@Injectable()
export class PrismaPropertyRepository implements IPropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== የመለወጫ ረዳት ዘዴዎች ====================
  
  private toPropertyEntity(prismaProperty: any): PropertyEntity {
    return new PropertyEntity({
      id: prismaProperty.id,
      title: prismaProperty.title,
      description: prismaProperty.description,
      propertyType: prismaProperty.propertyType,
      status: prismaProperty.status,
      bedrooms: prismaProperty.bedrooms,
      bathrooms: prismaProperty.bathrooms,
      area: prismaProperty.area,
      floor: prismaProperty.floor,
      totalFloors: prismaProperty.totalFloors,
      hasFurniture: prismaProperty.hasFurniture,
      hasParking: prismaProperty.hasParking,
      hasElevator: prismaProperty.hasElevator,
      hasBalcony: prismaProperty.hasBalcony,
      hasGarden: prismaProperty.hasGarden,
      hasSecurity: prismaProperty.hasSecurity,
      hasBackupGenerator: prismaProperty.hasBackupGenerator,
      hasWaterTank: prismaProperty.hasWaterTank,
      monthlyRent: prismaProperty.monthlyRent,
      securityDeposit: prismaProperty.securityDeposit,
      minimumLeaseMonths: prismaProperty.minimumLeaseMonths,
      isNegotiable: prismaProperty.isNegotiable,
      regionId: prismaProperty.regionId,
      zoneId: prismaProperty.zoneId,
      cityId: prismaProperty.cityId,
      subcityId: prismaProperty.subcityId,
      woredaId: prismaProperty.woredaId,
      kebeleId: prismaProperty.kebeleId,
      houseNumber: prismaProperty.houseNumber,
      streetName: prismaProperty.streetName,
      landmark: prismaProperty.landmark,
      latitude: prismaProperty.latitude,
      longitude: prismaProperty.longitude,
      googleMapsUrl: prismaProperty.googleMapsUrl,
      fullAddress: prismaProperty.fullAddress,
      isVerified: prismaProperty.isVerified,
      verifiedBy: prismaProperty.verifiedBy,
      verifiedAt: prismaProperty.verifiedAt,
      verificationDocument: prismaProperty.verificationDocument,
      kebeleSeal: prismaProperty.kebeleSeal,
      sealAppliedAt: prismaProperty.sealAppliedAt,
      sealExpiresAt: prismaProperty.sealExpiresAt,
      verificationHistory: prismaProperty.verificationHistory,
      viewCount: prismaProperty.viewCount,
      favoriteCount: prismaProperty.favoriteCount,
      inquiryCount: prismaProperty.inquiryCount,
      availableFrom: prismaProperty.availableFrom,
      isActive: prismaProperty.isActive,
      featured: prismaProperty.featured,
      priority: prismaProperty.priority,
      landlordId: prismaProperty.landlordId,
      brokerId: prismaProperty.brokerId,
      createdAt: prismaProperty.createdAt,
      updatedAt: prismaProperty.updatedAt,
      images: prismaProperty.images?.map((img: any) => this.toPropertyImageEntity(img)),
      features: prismaProperty.features?.map((feat: any) => this.toPropertyFeatureEntity(feat)),
    });
  }

  private toPropertyImageEntity(prismaImage: any): PropertyImageEntity {
    return new PropertyImageEntity({
      id: prismaImage.id,
      propertyId: prismaImage.propertyId,
      url: prismaImage.url,
      thumbnailUrl: prismaImage.thumbnailUrl,
      caption: prismaImage.caption,
      isPrimary: prismaImage.isPrimary,
      order: prismaImage.order,
      fileSize: prismaImage.fileSize,
      mimeType: prismaImage.mimeType,
      width: prismaImage.width,
      height: prismaImage.height,
      createdAt: prismaImage.createdAt,
    });
  }

  private toPropertyFeatureEntity(prismaFeature: any): PropertyFeatureEntity {
    return new PropertyFeatureEntity({
      id: prismaFeature.id,
      propertyId: prismaFeature.propertyId,
      name: prismaFeature.name,
      category: prismaFeature.category,
      createdAt: prismaFeature.createdAt,
    });
  }

  private toPropertyInquiryEntity(prismaInquiry: any): PropertyInquiryEntity {
    return new PropertyInquiryEntity({
      id: prismaInquiry.id,
      propertyId: prismaInquiry.propertyId,
      userId: prismaInquiry.userId,
      guestName: prismaInquiry.guestName,
      guestEmail: prismaInquiry.guestEmail,
      guestPhone: prismaInquiry.guestPhone,
      message: prismaInquiry.message,
      status: prismaInquiry.status,
      response: prismaInquiry.response,
      respondedBy: prismaInquiry.respondedBy,
      respondedAt: prismaInquiry.respondedAt,
      createdAt: prismaInquiry.createdAt,
      updatedAt: prismaInquiry.updatedAt,
    });
  }

  private toFavoriteEntity(prismaFavorite: any): FavoriteEntity {
    return new FavoriteEntity({
      id: prismaFavorite.id,
      userId: prismaFavorite.userId,
      propertyId: prismaFavorite.propertyId,
      createdAt: prismaFavorite.createdAt,
    });
  }

    // ==================== ዋና የቤት ማስተዳደር ዘዴዎች ====================

  async createProperty(property: Partial<PropertyEntity>): Promise<PropertyEntity> {
    const newProperty = await this.prisma.property.create({
      data: {
        title: property.title!,
        description: property.description!,
        propertyType: property.propertyType!,
        status: property.status || PropertyStatus.AVAILABLE,
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        area: property.area!,
        floor: property.floor,
        totalFloors: property.totalFloors,
        hasFurniture: property.hasFurniture || false,
        hasParking: property.hasParking || false,
        hasElevator: property.hasElevator || false,
        hasBalcony: property.hasBalcony || false,
        hasGarden: property.hasGarden || false,
        hasSecurity: property.hasSecurity || false,
        hasBackupGenerator: property.hasBackupGenerator || false,
        hasWaterTank: property.hasWaterTank || false,
        monthlyRent: property.monthlyRent!,
        securityDeposit: property.securityDeposit || 0,
        minimumLeaseMonths: property.minimumLeaseMonths || 6,
        isNegotiable: property.isNegotiable || false,
        regionId: property.regionId!,
        zoneId: property.zoneId,
        cityId: property.cityId,
        subcityId: property.subcityId,
        woredaId: property.woredaId,
        kebeleId: property.kebeleId,
        houseNumber: property.houseNumber,
        streetName: property.streetName,
        landmark: property.landmark,
        latitude: property.latitude,
        longitude: property.longitude,
        googleMapsUrl: property.googleMapsUrl,
        fullAddress: property.fullAddress,
        isVerified: property.isVerified || false,
        viewCount: property.viewCount || 0,
        favoriteCount: property.favoriteCount || 0,
        inquiryCount: property.inquiryCount || 0,
        isActive: property.isActive ?? true,
        featured: property.featured || false,
        priority: property.priority || 0,
        landlordId: property.landlordId!,
        brokerId: property.brokerId,
      },
      include: {
        images: true,
        features: true,
      },
    });

    return this.toPropertyEntity(newProperty);
  }

  async getPropertyById(id: string): Promise<PropertyEntity | null> {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        features: true,
      },
    });

    return property ? this.toPropertyEntity(property) : null;
  }

  async getPropertyByTitle(title: string): Promise<PropertyEntity | null> {
    const property = await this.prisma.property.findFirst({
      where: { title },
    });

    return property ? this.toPropertyEntity(property) : null;
  }

  async getAllProperties(
    skip: number = 0,
    take: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ data: PropertyEntity[]; total: number }> {
    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          features: true,
        },
      }),
      this.prisma.property.count(),
    ]);

    return {
      data: properties.map(p => this.toPropertyEntity(p)),
      total,
    };
  }

  async getPropertiesByLandlord(
    landlordId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: PropertyEntity[]; total: number }> {
    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where: { landlordId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          features: true,
        },
      }),
      this.prisma.property.count({ where: { landlordId } }),
    ]);

    return {
      data: properties.map(p => this.toPropertyEntity(p)),
      total,
    };
  }

  async getPropertiesByBroker(
    brokerId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: PropertyEntity[]; total: number }> {
    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where: { brokerId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          features: true,
        },
      }),
      this.prisma.property.count({ where: { brokerId } }),
    ]);

    return {
      data: properties.map(p => this.toPropertyEntity(p)),
      total,
    };
  }

  async updateProperty(id: string, property: Partial<PropertyEntity>): Promise<PropertyEntity> {
    const data: any = { ...property };
    
    // ቀን መቀየር አለብን
    delete data.id;
    delete data.createdAt;
    delete data.images;
    delete data.features;

    const updatedProperty = await this.prisma.property.update({
      where: { id },
      data,
      include: {
        images: true,
        features: true,
      },
    });

    return this.toPropertyEntity(updatedProperty);
  }

  async softDeleteProperty(id: string): Promise<PropertyEntity> {
    const deletedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        isActive: false,
        status: PropertyStatus.UNAVAILABLE,
      },
      include: {
        images: true,
        features: true,
      },
    });

    return this.toPropertyEntity(deletedProperty);
  }

  async hardDeleteProperty(id: string): Promise<void> {
    await this.prisma.property.delete({
      where: { id },
    });
  }

  async propertyExists(id: string): Promise<boolean> {
    const count = await this.prisma.property.count({
      where: { id },
    });
    return count > 0;
  }

  async verifyProperty(id: string, officialId: string, seal?: string): Promise<PropertyEntity> {
    const verifiedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedBy: officialId,
        verifiedAt: new Date(),
        kebeleSeal: seal,
        sealAppliedAt: seal ? new Date() : null,
        sealExpiresAt: seal ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : null,
      },
      include: {
        images: true,
        features: true,
      },
    });

    return this.toPropertyEntity(verifiedProperty);
  }

  async renewPropertySeal(id: string, officialId: string, seal: string): Promise<PropertyEntity> {
    const renewedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        verifiedBy: officialId,
        kebeleSeal: seal,
        sealAppliedAt: new Date(),
        sealExpiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
      include: {
        images: true,
        features: true,
      },
    });

    return this.toPropertyEntity(renewedProperty);
  }

  async featureProperty(id: string, priority: number): Promise<PropertyEntity> {
    const featuredProperty = await this.prisma.property.update({
      where: { id },
      data: {
        featured: true,
        priority,
      },
      include: {
        images: true,
        features: true,
      },
    });

    return this.toPropertyEntity(featuredProperty);
  }

  async unfeatureProperty(id: string): Promise<PropertyEntity> {
    const unfeaturedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        featured: false,
        priority: 0,
      },
      include: {
        images: true,
        features: true,
      },
    });

    return this.toPropertyEntity(unfeaturedProperty);
  }

  async changePropertyStatus(id: string, status: PropertyStatus): Promise<PropertyEntity> {
    const updatedProperty = await this.prisma.property.update({
      where: { id },
      data: { status },
      include: {
        images: true,
        features: true,
      },
    });

    return this.toPropertyEntity(updatedProperty);
  }

  async incrementPropertyViewCount(id: string): Promise<void> {
    await this.prisma.property.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  async incrementPropertyInquiryCount(propertyId: string): Promise<void> {
    await this.prisma.property.update({
      where: { id: propertyId },
      data: {
        inquiryCount: {
          increment: 1,
        },
      },
    });
  }
    // ==================== የቤት ፎቶዎች አስተዳደር ====================

  async getPropertyImages(propertyId: string): Promise<PropertyImageEntity[]> {
    const images = await this.prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { order: 'asc' },
    });

    return images.map(img => this.toPropertyImageEntity(img));
  }

  async getPropertyImageById(id: string): Promise<PropertyImageEntity | null> {
    const image = await this.prisma.propertyImage.findUnique({
      where: { id },
    });

    return image ? this.toPropertyImageEntity(image) : null;
  }

  async getPrimaryPropertyImage(propertyId: string): Promise<PropertyImageEntity | null> {
    const image = await this.prisma.propertyImage.findFirst({
      where: {
        propertyId,
        isPrimary: true,
      },
    });

    return image ? this.toPropertyImageEntity(image) : null;
  }

  async addPropertyImage(propertyId: string, image: Partial<PropertyImageEntity>): Promise<PropertyImageEntity> {
    const newImage = await this.prisma.propertyImage.create({
      data: {
        propertyId,
        url: image.url!,
        thumbnailUrl: image.thumbnailUrl,
        caption: image.caption,
        isPrimary: image.isPrimary || false,
        order: image.order || 0,
        fileSize: image.fileSize,
        mimeType: image.mimeType,
        width: image.width,
        height: image.height,
      },
    });

    // ይሄ ዋና ፎቶ ከሆነ ሌሎችን ዋናነት አስወግድ
    if (image.isPrimary) {
      await this.prisma.propertyImage.updateMany({
        where: {
          propertyId,
          id: { not: newImage.id },
        },
        data: { isPrimary: false },
      });
    }

    return this.toPropertyImageEntity(newImage);
  }

async addMultiplePropertyImages(propertyId: string, images: Partial<PropertyImageEntity>[]): Promise<PropertyImageEntity[]> {
  const createdImages: PropertyImageEntity[] = [];  // 👈 አይነቱን ጨምር

  for (const image of images) {
    const newImage = await this.addPropertyImage(propertyId, image);
    createdImages.push(newImage);
  }

  return createdImages;
}

  async updatePropertyImage(id: string, image: Partial<PropertyImageEntity>): Promise<PropertyImageEntity> {
    const data: any = { ...image };
    delete data.id;
    delete data.propertyId;
    delete data.createdAt;

    const updatedImage = await this.prisma.propertyImage.update({
      where: { id },
      data,
    });

    // ይሄ ዋና ፎቶ ከሆነ ሌሎችን ዋናነት አስወግድ
    if (image.isPrimary) {
      await this.prisma.propertyImage.updateMany({
        where: {
          propertyId: updatedImage.propertyId,
          id: { not: id },
        },
        data: { isPrimary: false },
      });
    }

    return this.toPropertyImageEntity(updatedImage);
  }

  async deletePropertyImage(id: string): Promise<void> {
    const image = await this.prisma.propertyImage.findUnique({
      where: { id },
    });

    await this.prisma.propertyImage.delete({
      where: { id },
    });

    // የተሰረዘው ዋና ፎቶ ከሆነ ሌላ ፎቶ ዋና አድርግ
    if (image?.isPrimary) {
      const anotherImage = await this.prisma.propertyImage.findFirst({
        where: { propertyId: image.propertyId },
        orderBy: { order: 'asc' },
      });

      if (anotherImage) {
        await this.prisma.propertyImage.update({
          where: { id: anotherImage.id },
          data: { isPrimary: true },
        });
      }
    }
  }

  async deleteAllPropertyImages(propertyId: string): Promise<void> {
    await this.prisma.propertyImage.deleteMany({
      where: { propertyId },
    });
  }

  async setPrimaryPropertyImage(propertyId: string, imageId: string): Promise<void> {
    // ሁሉንም ዋናነት አስወግድ
    await this.prisma.propertyImage.updateMany({
      where: { propertyId },
      data: { isPrimary: false },
    });

    // የተመረጠውን ፎቶ ዋና አድርግ
    await this.prisma.propertyImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });
  }

  async reorderPropertyImages(propertyId: string, imageIds: string[]): Promise<void> {
    for (let i = 0; i < imageIds.length; i++) {
      await this.prisma.propertyImage.update({
        where: { id: imageIds[i] },
        data: { order: i },
      });
    }
  }
  // ==================== የቤት ጥያቄዎች አስተዳደር ====================

  async createInquiry(inquiry: Partial<PropertyInquiryEntity>): Promise<PropertyInquiryEntity> {
    const newInquiry = await this.prisma.propertyInquiry.create({
      data: {
        propertyId: inquiry.propertyId!,
        userId: inquiry.userId,
        guestName: inquiry.guestName,
        guestEmail: inquiry.guestEmail,
        guestPhone: inquiry.guestPhone,
        message: inquiry.message!,
        status: InquiryStatus.PENDING,
      },
    });

    return this.toPropertyInquiryEntity(newInquiry);
  }

  async getInquiryById(id: string): Promise<PropertyInquiryEntity | null> {
    const inquiry = await this.prisma.propertyInquiry.findUnique({
      where: { id },
    });

    return inquiry ? this.toPropertyInquiryEntity(inquiry) : null;
  }

  async getInquiriesByProperty(
    propertyId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: PropertyInquiryEntity[]; total: number }> {
    const [inquiries, total] = await Promise.all([
      this.prisma.propertyInquiry.findMany({
        where: { propertyId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.propertyInquiry.count({ where: { propertyId } }),
    ]);

    return {
      data: inquiries.map(i => this.toPropertyInquiryEntity(i)),
      total,
    };
  }

  async getInquiriesByUser(
    userId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: PropertyInquiryEntity[]; total: number }> {
    const [inquiries, total] = await Promise.all([
      this.prisma.propertyInquiry.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.propertyInquiry.count({ where: { userId } }),
    ]);

    return {
      data: inquiries.map(i => this.toPropertyInquiryEntity(i)),
      total,
    };
  }

  async getInquiriesByGuestEmail(
    email: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: PropertyInquiryEntity[]; total: number }> {
    const [inquiries, total] = await Promise.all([
      this.prisma.propertyInquiry.findMany({
        where: { guestEmail: email },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.propertyInquiry.count({ where: { guestEmail: email } }),
    ]);

    return {
      data: inquiries.map(i => this.toPropertyInquiryEntity(i)),
      total,
    };
  }

  async getInquiriesByStatus(
    status: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: PropertyInquiryEntity[]; total: number }> {
    const [inquiries, total] = await Promise.all([
      this.prisma.propertyInquiry.findMany({
        where: { status: status as InquiryStatus },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.propertyInquiry.count({ where: { status: status as InquiryStatus } }),
    ]);

    return {
      data: inquiries.map(i => this.toPropertyInquiryEntity(i)),
      total,
    };
  }

  async getPendingInquiries(
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: PropertyInquiryEntity[]; total: number }> {
    return this.getInquiriesByStatus(InquiryStatus.PENDING, skip, take);
  }

  async updateInquiry(id: string, inquiry: Partial<PropertyInquiryEntity>): Promise<PropertyInquiryEntity> {
    const data: any = { ...inquiry };
    delete data.id;
    delete data.propertyId;
    delete data.createdAt;

    const updatedInquiry = await this.prisma.propertyInquiry.update({
      where: { id },
      data,
    });

    return this.toPropertyInquiryEntity(updatedInquiry);
  }

  async respondToInquiry(id: string, response: string, responderId: string): Promise<PropertyInquiryEntity> {
    const updatedInquiry = await this.prisma.propertyInquiry.update({
      where: { id },
      data: {
        response,
        respondedBy: responderId,
        respondedAt: new Date(),
        status: InquiryStatus.RESPONDED,
      },
    });

    return this.toPropertyInquiryEntity(updatedInquiry);
  }

  async closeInquiry(id: string): Promise<PropertyInquiryEntity> {
    const updatedInquiry = await this.prisma.propertyInquiry.update({
      where: { id },
      data: {
        status: InquiryStatus.CLOSED,
      },
    });

    return this.toPropertyInquiryEntity(updatedInquiry);
  }

  async markInquiryAsSpam(id: string): Promise<PropertyInquiryEntity> {
    const updatedInquiry = await this.prisma.propertyInquiry.update({
      where: { id },
      data: {
        status: InquiryStatus.SPAM,
      },
    });

    return this.toPropertyInquiryEntity(updatedInquiry);
  }

  async deleteInquiry(id: string): Promise<void> {
    await this.prisma.propertyInquiry.delete({
      where: { id },
    });
  }

  async countPropertyInquiries(propertyId: string): Promise<number> {
    return this.prisma.propertyInquiry.count({
      where: { propertyId },
    });
  }
    // ==================== ተወዳጅ ቤቶች አስተዳደር ====================

  async addFavorite(userId: string, propertyId: string): Promise<FavoriteEntity> {
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        propertyId,
      },
    });

    // የቤት ተወዳጅ ቆጠራ ጨምር
    await this.prisma.property.update({
      where: { id: propertyId },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    });

    return this.toFavoriteEntity(favorite);
  }

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    await this.prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    // የቤት ተወዳጅ ቆጠራ ቀንስ
    await this.prisma.property.update({
      where: { id: propertyId },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });
  }

  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    const count = await this.prisma.favorite.count({
      where: {
        userId,
        propertyId,
      },
    });

    return count > 0;
  }

  async getUserFavorites(
    userId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: FavoriteEntity[]; total: number }> {
    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      data: favorites.map(f => this.toFavoriteEntity(f)),
      total,
    };
  }

  async countUserFavorites(userId: string): Promise<number> {
    return this.prisma.favorite.count({
      where: { userId },
    });
  }

  async countPropertyFavorites(propertyId: string): Promise<number> {
    return this.prisma.favorite.count({
      where: { propertyId },
    });
  }

  async getPropertyFavoriters(propertyId: string): Promise<string[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { propertyId },
      select: { userId: true },
    });

    return favorites.map(f => f.userId);
  }

  async getRecentlyFavoritedProperties(limit: number = 10): Promise<PropertyEntity[]> {
    const recentFavorites = await this.prisma.favorite.groupBy({
      by: ['propertyId'],
      _count: {
        propertyId: true,
      },
      orderBy: {
        _max: {
          createdAt: 'desc',
        },
      },
      take: limit,
    });

    const propertyIds = recentFavorites.map(f => f.propertyId);
    
    const properties = await this.prisma.property.findMany({
      where: {
        id: { in: propertyIds },
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        features: true,
      },
    });

    return properties.map(p => this.toPropertyEntity(p));
  }
    // ==================== የማረጋገጫ ታሪክ ====================

async addVerificationHistory(propertyId: string, verificationData: any): Promise<void> {
  const property = await this.prisma.property.findUnique({
    where: { id: propertyId },
    select: { verificationHistory: true },
  });

  // ያለውን ታሪክ አምጣ
  let currentHistory: any[] = [];
  
  if (property?.verificationHistory) {
    if (Array.isArray(property.verificationHistory)) {
      currentHistory = property.verificationHistory as any[];
    } else {
      currentHistory = [property.verificationHistory];
    }
  }

  // አዲስ መዝገብ ጨምር
  const newHistory = [
    ...currentHistory,
    {
      ...verificationData,
      timestamp: new Date().toISOString(),
    },
  ];

  // ማዘመን
  await this.prisma.property.update({
    where: { id: propertyId },
    data: {
      verificationHistory: newHistory,
    },
  });
}
  async getVerificationHistory(propertyId: string): Promise<any> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: { verificationHistory: true },
    });

    return property?.verificationHistory || [];
  }

  // ==================== ስታቲስቲክስ ====================

  async getPropertyStatistics(): Promise<{
    total: number;
    verified: number;
    unverified: number;
    available: number;
    rented: number;
    featured: number;
    averagePrice: number;
    totalViews: number;
    totalFavorites: number;
  }> {
    const [
      total,
      verified,
      available,
      rented,
      featured,
      priceAggregation,
      viewsAggregation,
      favoritesAggregation,
    ] = await Promise.all([
      this.prisma.property.count(),
      this.prisma.property.count({ where: { isVerified: true } }),
      this.prisma.property.count({ where: { status: PropertyStatus.AVAILABLE } }),
      this.prisma.property.count({ where: { status: PropertyStatus.RENTED } }),
      this.prisma.property.count({ where: { featured: true } }),
      this.prisma.property.aggregate({
        _avg: { monthlyRent: true },
      }),
      this.prisma.property.aggregate({
        _sum: { viewCount: true },
      }),
      this.prisma.property.aggregate({
        _sum: { favoriteCount: true },
      }),
    ]);

    return {
      total,
      verified,
      unverified: total - verified,
      available,
      rented,
      featured,
      averagePrice: priceAggregation._avg.monthlyRent || 0,
      totalViews: viewsAggregation._sum.viewCount || 0,
      totalFavorites: favoritesAggregation._sum.favoriteCount || 0,
    };
  }

  async getAveragePriceByLocation(regionId?: string, cityId?: string): Promise<number> {
    const where: Prisma.PropertyWhereInput = {};

    if (regionId) where.regionId = regionId;
    if (cityId) where.cityId = cityId;

    const result = await this.prisma.property.aggregate({
      where,
      _avg: { monthlyRent: true },
    });

    return result._avg.monthlyRent || 0;
  }

  async getAveragePriceByPropertyType(propertyType: string): Promise<number> {
    const result = await this.prisma.property.aggregate({
      where: { propertyType: propertyType as PropertyType },
      _avg: { monthlyRent: true },
    });

    return result._avg.monthlyRent || 0;
  }
  // ==================== የቤት ፍለጋ እና ማጣሪያ (የጎደሉት) ====================

async getPropertiesByLocation(
  regionId?: string,
  zoneId?: string,
  cityId?: string,
  subcityId?: string,
  woredaId?: string,
  kebeleId?: string
): Promise<PropertyEntity[]> {
  const where: Prisma.PropertyWhereInput = { isActive: true };

  if (regionId) where.regionId = regionId;
  if (zoneId) where.zoneId = zoneId;
  if (cityId) where.cityId = cityId;
  if (subcityId) where.subcityId = subcityId;
  if (woredaId) where.woredaId = woredaId;
  if (kebeleId) where.kebeleId = kebeleId;

  const properties = await this.prisma.property.findMany({
    where,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getPropertiesByPriceRange(minPrice: number, maxPrice: number): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: {
      isActive: true,
      monthlyRent: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { monthlyRent: 'asc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getPropertiesByBedrooms(bedrooms: number): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: {
      isActive: true,
      bedrooms,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getPropertiesByBathrooms(bathrooms: number): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: {
      isActive: true,
      bathrooms,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getPropertiesByAreaRange(minArea: number, maxArea: number): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: {
      isActive: true,
      area: {
        gte: minArea,
        lte: maxArea,
      },
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { area: 'asc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getPropertiesByPropertyType(propertyType: string): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: {
      isActive: true,
      propertyType: propertyType as PropertyType,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getPropertiesByStatus(status: string): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: {
      isActive: true,
      status: status as PropertyStatus,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getPropertiesWithAmenities(amenities: {
  hasFurniture?: boolean;
  hasParking?: boolean;
  hasElevator?: boolean;
  hasBalcony?: boolean;
  hasGarden?: boolean;
  hasSecurity?: boolean;
}): Promise<PropertyEntity[]> {
  const where: Prisma.PropertyWhereInput = { isActive: true };

  if (amenities.hasFurniture !== undefined) where.hasFurniture = amenities.hasFurniture;
  if (amenities.hasParking !== undefined) where.hasParking = amenities.hasParking;
  if (amenities.hasElevator !== undefined) where.hasElevator = amenities.hasElevator;
  if (amenities.hasBalcony !== undefined) where.hasBalcony = amenities.hasBalcony;
  if (amenities.hasGarden !== undefined) where.hasGarden = amenities.hasGarden;
  if (amenities.hasSecurity !== undefined) where.hasSecurity = amenities.hasSecurity;

  const properties = await this.prisma.property.findMany({
    where,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

// ==================== የቤት ፍለጋ እና ማጣሪያ ====================

async searchProperties(filters: {
  keyword?: string;
  regionId?: string;
  zoneId?: string;
  cityId?: string;
  subcityId?: string;
  woredaId?: string;
  kebeleId?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  propertyType?: string;
  status?: string;
  hasFurniture?: boolean;
  hasParking?: boolean;
  hasElevator?: boolean;
  hasBalcony?: boolean;
  hasGarden?: boolean;
  hasSecurity?: boolean;
  isVerified?: boolean;
  featured?: boolean;
  skip?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ data: PropertyEntity[]; total: number }> {
  const where: Prisma.PropertyWhereInput = { isActive: true };

  // የቁልፍ ቃል ፍለጋ
  if (filters.keyword) {
    where.OR = [
      { title: { contains: filters.keyword, mode: 'insensitive' } },
      { description: { contains: filters.keyword, mode: 'insensitive' } },
      { fullAddress: { contains: filters.keyword, mode: 'insensitive' } },
    ];
  }

  // የአካባቢ ማጣሪያ
  if (filters.regionId) where.regionId = filters.regionId;
  if (filters.zoneId) where.zoneId = filters.zoneId;
  if (filters.cityId) where.cityId = filters.cityId;
  if (filters.subcityId) where.subcityId = filters.subcityId;
  if (filters.woredaId) where.woredaId = filters.woredaId;
  if (filters.kebeleId) where.kebeleId = filters.kebeleId;

  // የዋጋ ማጣሪያ
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.monthlyRent = {};
    if (filters.minPrice !== undefined) where.monthlyRent.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.monthlyRent.lte = filters.maxPrice;
  }

  // የቤት ዝርዝሮች ማጣሪያ
  if (filters.bedrooms !== undefined) where.bedrooms = filters.bedrooms;
  if (filters.bathrooms !== undefined) where.bathrooms = filters.bathrooms;
  
  if (filters.minArea !== undefined || filters.maxArea !== undefined) {
    where.area = {};
    if (filters.minArea !== undefined) where.area.gte = filters.minArea;
    if (filters.maxArea !== undefined) where.area.lte = filters.maxArea;
  }

  // የቤት አይነት እና ሁኔታ
  if (filters.propertyType) where.propertyType = filters.propertyType as PropertyType;
  if (filters.status) where.status = filters.status as PropertyStatus;

  // ተጨማሪ መገልገያዎች
  if (filters.hasFurniture !== undefined) where.hasFurniture = filters.hasFurniture;
  if (filters.hasParking !== undefined) where.hasParking = filters.hasParking;
  if (filters.hasElevator !== undefined) where.hasElevator = filters.hasElevator;
  if (filters.hasBalcony !== undefined) where.hasBalcony = filters.hasBalcony;
  if (filters.hasGarden !== undefined) where.hasGarden = filters.hasGarden;
  if (filters.hasSecurity !== undefined) where.hasSecurity = filters.hasSecurity;

  // ማረጋገጫ ማጣሪያ
  if (filters.isVerified !== undefined) where.isVerified = filters.isVerified;
  if (filters.featured !== undefined) where.featured = filters.featured;

  // ደረደር (Sorting)
  const orderBy: any = {};
  if (filters.sortBy) {
    orderBy[filters.sortBy] = filters.sortOrder || 'desc';
  } else {
    orderBy.createdAt = 'desc';
  }

  const [properties, total] = await Promise.all([
    this.prisma.property.findMany({
      where,
      skip: filters.skip || 0,
      take: filters.take || 10,
      orderBy,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        features: true,
      },
    }),
    this.prisma.property.count({ where }),
  ]);

  return {
    data: properties.map(p => this.toPropertyEntity(p)),
    total,
  };
}

async getVerifiedProperties(): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: {
      isActive: true,
      isVerified: true,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { verifiedAt: 'desc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getUnverifiedProperties(): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: {
      isActive: true,
      isVerified: false,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getFeaturedProperties(limit: number = 10): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: {
      isActive: true,
      featured: true,
    },
    take: limit,
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getMostViewedProperties(limit: number = 10): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: { isActive: true },
    take: limit,
    orderBy: { viewCount: 'desc' },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getMostFavoritedProperties(limit: number = 10): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: { isActive: true },
    take: limit,
    orderBy: { favoriteCount: 'desc' },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
  });

  return properties.map(p => this.toPropertyEntity(p));
}

async getNewestProperties(limit: number = 10): Promise<PropertyEntity[]> {
  const properties = await this.prisma.property.findMany({
    where: { isActive: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      features: true,
    },
  });

  return properties.map(p => this.toPropertyEntity(p));
}
// ==================== የቤት ባህሪያት አስተዳደር ====================

async getPropertyFeatures(propertyId: string): Promise<PropertyFeatureEntity[]> {
  const features = await this.prisma.propertyFeature.findMany({
    where: { propertyId },
    orderBy: { category: 'asc' },
  });

  return features.map(f => this.toPropertyFeatureEntity(f));
}

async getPropertyFeatureById(id: string): Promise<PropertyFeatureEntity | null> {
  const feature = await this.prisma.propertyFeature.findUnique({
    where: { id },
  });

  return feature ? this.toPropertyFeatureEntity(feature) : null;
}

async addPropertyFeature(propertyId: string, feature: Partial<PropertyFeatureEntity>): Promise<PropertyFeatureEntity> {
  const newFeature = await this.prisma.propertyFeature.create({
    data: {
      propertyId,
      name: feature.name!,
      category: feature.category,
    },
  });

  return this.toPropertyFeatureEntity(newFeature);
}

async addMultiplePropertyFeatures(propertyId: string, features: Partial<PropertyFeatureEntity>[]): Promise<PropertyFeatureEntity[]> {
  const createdFeatures: PropertyFeatureEntity[] = [];

  for (const feature of features) {
    const newFeature = await this.addPropertyFeature(propertyId, feature);
    createdFeatures.push(newFeature);
  }

  return createdFeatures;
}

async updatePropertyFeature(id: string, feature: Partial<PropertyFeatureEntity>): Promise<PropertyFeatureEntity> {
  const data: any = { ...feature };
  delete data.id;
  delete data.propertyId;
  delete data.createdAt;

  const updatedFeature = await this.prisma.propertyFeature.update({
    where: { id },
    data,
  });

  return this.toPropertyFeatureEntity(updatedFeature);
}

async deletePropertyFeature(id: string): Promise<void> {
  await this.prisma.propertyFeature.delete({
    where: { id },
  });
}

async deleteAllPropertyFeatures(propertyId: string): Promise<void> {
  await this.prisma.propertyFeature.deleteMany({
    where: { propertyId },
  });
}

async propertyFeatureExists(propertyId: string, featureName: string): Promise<boolean> {
  const count = await this.prisma.propertyFeature.count({
    where: {
      propertyId,
      name: featureName,
    },
  });

  return count > 0;
}

async getPropertyFeaturesByCategory(propertyId: string, category: string): Promise<PropertyFeatureEntity[]> {
  const features = await this.prisma.propertyFeature.findMany({
    where: {
      propertyId,
      category,
    },
  });

  return features.map(f => this.toPropertyFeatureEntity(f));
}


}