import { PropertyEntity } from '../../entities/property.entity';
import { PropertyImageEntity } from '../../entities/property-image.entity';
import { PropertyFeatureEntity } from '../../entities/property-feature.entity';
import { PropertyInquiryEntity } from '../../entities/property-inquiry.entity';
import { FavoriteEntity } from '../../entities/favorite.entity';

export interface IPropertyRepository {
  
  // ==================== ዋና የቤት ማስተዳደር ዘዴዎች ====================
  
  // አዲስ ቤት መፍጠር
  createProperty(property: Partial<PropertyEntity>): Promise<PropertyEntity>;
  
  // ቤት በID ማግኘት
  getPropertyById(id: string): Promise<PropertyEntity | null>;
  
  // ቤት በርዕስ ማግኘት (ለማረጋገጫ)
  getPropertyByTitle(title: string): Promise<PropertyEntity | null>;
  
  // ሁሉንም ቤቶች ማግኘት
  getAllProperties(
    skip?: number, 
    take?: number, 
    sortBy?: string, 
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ data: PropertyEntity[]; total: number }>;
  
  // በባለቤት የሚገኙ ቤቶችን ማግኘት
  getPropertiesByLandlord(
    landlordId: string,
    skip?: number,
    take?: number
  ): Promise<{ data: PropertyEntity[]; total: number }>;
  
  // በደላላ የሚተዳደሩ ቤቶችን ማግኘት
  getPropertiesByBroker(
    brokerId: string,
    skip?: number,
    take?: number
  ): Promise<{ data: PropertyEntity[]; total: number }>;
  
  // ቤት ማዘመን
  updateProperty(id: string, property: Partial<PropertyEntity>): Promise<PropertyEntity>;
  
  // ቤት መሰረዝ (ለስላሳ ሰርዝ)
  softDeleteProperty(id: string): Promise<PropertyEntity>;
  
  // ቤት ሙሉ በሙሉ መሰረዝ (ለሱፐር አድሚን ብቻ)
  hardDeleteProperty(id: string): Promise<void>;
  
  // ቤት መኖሩን ማረጋገጥ
  propertyExists(id: string): Promise<boolean>;
  
  // ቤት ማረጋገጥ (ለቀበሌ)
  verifyProperty(id: string, officialId: string, seal?: string): Promise<PropertyEntity>;
  
  // የቤት ማህተም ማደስ
  renewPropertySeal(id: string, officialId: string, seal: string): Promise<PropertyEntity>;
  
  // ቤት ማሳደግ (featured)
  featureProperty(id: string, priority: number): Promise<PropertyEntity>;
  
  // ማሳደግን ማስወገድ
  unfeatureProperty(id: string): Promise<PropertyEntity>;
  
  // የቤት ሁኔታ መቀየር
  changePropertyStatus(id: string, status: string): Promise<PropertyEntity>;
  
  // የቤት እይታ ቆጠራ መጨመር
  incrementPropertyViewCount(id: string): Promise<void>;
  
  // ==================== የቤት ፍለጋ እና ማጣሪያ ====================
  
  // በተለያዩ መስፈርቶች ቤቶችን መፈለግ
  searchProperties(filters: {
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
  }): Promise<{ data: PropertyEntity[]; total: number }>;
  
  // በአካባቢ የሚገኙ ቤቶችን ማግኘት
  getPropertiesByLocation(
    regionId?: string,
    zoneId?: string,
    cityId?: string,
    subcityId?: string,
    woredaId?: string,
    kebeleId?: string
  ): Promise<PropertyEntity[]>;
  
  // በዋጋ መጠን የሚገኙ ቤቶችን ማግኘት
  getPropertiesByPriceRange(minPrice: number, maxPrice: number): Promise<PropertyEntity[]>;
  
  // በክፍል ብዛት የሚገኙ ቤቶችን ማግኘት
  getPropertiesByBedrooms(bedrooms: number): Promise<PropertyEntity[]>;
  
  // የተረጋገጡ ቤቶችን ማግኘት
  getVerifiedProperties(): Promise<PropertyEntity[]>;
  
  // ያልተረጋገጡ ቤቶችን ማግኘት (ለቀበሌ)
  getUnverifiedProperties(): Promise<PropertyEntity[]>;
  
  // ተለይተው የሚታዩ ቤቶችን ማግኘት
  getFeaturedProperties(limit?: number): Promise<PropertyEntity[]>;
  
  // በጣም የታዩ ቤቶችን ማግኘት
  getMostViewedProperties(limit?: number): Promise<PropertyEntity[]>;
  
  // በጣም የተወደዱ ቤቶችን ማግኘት
  getMostFavoritedProperties(limit?: number): Promise<PropertyEntity[]>;
  
  // አዳዲስ ቤቶችን ማግኘት
  getNewestProperties(limit?: number): Promise<PropertyEntity[]>;
  
  // ==================== የቤት ፎቶዎች አስተዳደር ====================
  
  // ለአንድ ቤት ፎቶዎችን ማግኘት
  getPropertyImages(propertyId: string): Promise<PropertyImageEntity[]>;
  
  // አንድ ፎቶ በID ማግኘት
  getPropertyImageById(id: string): Promise<PropertyImageEntity | null>;
  
  // ዋና ፎቶ ማግኘት
  getPrimaryPropertyImage(propertyId: string): Promise<PropertyImageEntity | null>;
  
  // አዲስ ፎቶ መጨመር
  addPropertyImage(propertyId: string, image: Partial<PropertyImageEntity>): Promise<PropertyImageEntity>;
  
  // በርካታ ፎቶዎችን መጨመር
  addMultiplePropertyImages(propertyId: string, images: Partial<PropertyImageEntity>[]): Promise<PropertyImageEntity[]>;
  
  // ፎቶ ማዘመን
  updatePropertyImage(id: string, image: Partial<PropertyImageEntity>): Promise<PropertyImageEntity>;
  
  // ፎቶ መሰረዝ
  deletePropertyImage(id: string): Promise<void>;
  
  // የቤት ፎቶዎችን ሁሉ መሰረዝ
  deleteAllPropertyImages(propertyId: string): Promise<void>;
  
  // ዋና ፎቶ ማዘጋጀት (ሌሎችን ዋናነት ያስወግዳል)
  setPrimaryPropertyImage(propertyId: string, imageId: string): Promise<void>;
  
  // የፎቶዎችን ቅደም ተከተል ማስተካከል
  reorderPropertyImages(propertyId: string, imageIds: string[]): Promise<void>;
  
  // ==================== የቤት ባህሪያት አስተዳደር ====================
  
  // ለአንድ ቤት ባህሪያትን ማግኘት
  getPropertyFeatures(propertyId: string): Promise<PropertyFeatureEntity[]>;
  
  // አንድ ባህሪ በID ማግኘት
  getPropertyFeatureById(id: string): Promise<PropertyFeatureEntity | null>;
  
  // አዲስ ባህሪ መጨመር
  addPropertyFeature(propertyId: string, feature: Partial<PropertyFeatureEntity>): Promise<PropertyFeatureEntity>;
  
  // በርካታ ባህሪያትን መጨመር
  addMultiplePropertyFeatures(propertyId: string, features: Partial<PropertyFeatureEntity>[]): Promise<PropertyFeatureEntity[]>;
  
  // ባህሪ ማዘመን
  updatePropertyFeature(id: string, feature: Partial<PropertyFeatureEntity>): Promise<PropertyFeatureEntity>;
  
  // ባህሪ መሰረዝ
  deletePropertyFeature(id: string): Promise<void>;
  
  // የቤት ባህሪያትን ሁሉ መሰረዝ
  deleteAllPropertyFeatures(propertyId: string): Promise<void>;
  
  // ባህሪ በስም መኖሩን ማረጋገጥ (ለተመሳሳይ ቤት)
  propertyFeatureExists(propertyId: string, featureName: string): Promise<boolean>;
  
  // በምድብ የሚገኙ ባህሪያትን ማግኘት
  getPropertyFeaturesByCategory(propertyId: string, category: string): Promise<PropertyFeatureEntity[]>;
  
  // ==================== የቤት ጥያቄዎች አስተዳደር ====================
  
  // አዲስ ጥያቄ መፍጠር
  createInquiry(inquiry: Partial<PropertyInquiryEntity>): Promise<PropertyInquiryEntity>;
  
  // ጥያቄ በID ማግኘት
  getInquiryById(id: string): Promise<PropertyInquiryEntity | null>;
  
  // ለአንድ ቤት የሚገኙ ጥያቄዎችን ማግኘት
  getInquiriesByProperty(
    propertyId: string,
    skip?: number,
    take?: number
  ): Promise<{ data: PropertyInquiryEntity[]; total: number }>;
  
  // በተጠቃሚ የተላኩ ጥያቄዎችን ማግኘት
  getInquiriesByUser(
    userId: string,
    skip?: number,
    take?: number
  ): Promise<{ data: PropertyInquiryEntity[]; total: number }>;
  
  // በእንግዳ ኢሜይል የተላኩ ጥያቄዎችን ማግኘት
  getInquiriesByGuestEmail(
    email: string,
    skip?: number,
    take?: number
  ): Promise<{ data: PropertyInquiryEntity[]; total: number }>;
  
  // በሁኔታ የሚገኙ ጥያቄዎችን ማግኘት
  getInquiriesByStatus(
    status: string,
    skip?: number,
    take?: number
  ): Promise<{ data: PropertyInquiryEntity[]; total: number }>;
  
  // ምላሽ ያልተሰጣቸው ጥያቄዎችን ማግኘት
  getPendingInquiries(skip?: number, take?: number): Promise<{ data: PropertyInquiryEntity[]; total: number }>;
  
  // ጥያቄ ማዘመን
  updateInquiry(id: string, inquiry: Partial<PropertyInquiryEntity>): Promise<PropertyInquiryEntity>;
  
  // ለጥያቄ ምላሽ መስጠት
  respondToInquiry(id: string, response: string, responderId: string): Promise<PropertyInquiryEntity>;
  
  // ጥያቄ መዝጋት
  closeInquiry(id: string): Promise<PropertyInquiryEntity>;
  
  // ጥያቄ እንደ አይፈለጌ መልዕክት ምልክት ማድረግ
  markInquiryAsSpam(id: string): Promise<PropertyInquiryEntity>;
  
  // ጥያቄ መሰረዝ
  deleteInquiry(id: string): Promise<void>;
  
  // የቤት ጥያቄዎችን ቁጥር ማግኘት
  countPropertyInquiries(propertyId: string): Promise<number>;
  
  // ==================== ተወዳጅ ቤቶች አስተዳደር ====================
  
  // ቤት መውደድ
  addFavorite(userId: string, propertyId: string): Promise<FavoriteEntity>;
  
  // ቤት መውደድን ማስወገድ
  removeFavorite(userId: string, propertyId: string): Promise<void>;
  
  // ተጠቃሚ ቤቱን ወዶ መሆኑን ማረጋገጥ
  isFavorite(userId: string, propertyId: string): Promise<boolean>;
  
  // ተጠቃሚ የወደዳቸውን ቤቶች ማግኘት
  getUserFavorites(
    userId: string,
    skip?: number,
    take?: number
  ): Promise<{ data: FavoriteEntity[]; total: number }>;
  
  // ተጠቃሚ የወደዳቸውን ቤቶች ቁጥር ማግኘት
  countUserFavorites(userId: string): Promise<number>;
  
  // አንድ ቤት ስንት ጊዜ እንደተወደደ ማግኘት
  countPropertyFavorites(propertyId: string): Promise<number>;
  
  // ቤትን የወደዱ ተጠቃሚዎችን ማግኘት
  getPropertyFavoriters(propertyId: string): Promise<string[]>; // የተጠቃሚ አይዲዎች
  
  // በቅርቡ የተወደዱ ቤቶችን ማግኘት
  getRecentlyFavoritedProperties(limit?: number): Promise<PropertyEntity[]>;
  
  // ==================== የማረጋገጫ ታሪክ ====================
  
  // የማረጋገጫ ታሪክ ማስመዝገብ
  addVerificationHistory(propertyId: string, verificationData: any): Promise<void>;
  
  // የማረጋገጫ ታሪክ ማግኘት
  getVerificationHistory(propertyId: string): Promise<any>;
  
  // ==================== ስታቲስቲክስ ====================
  
  // አጠቃላይ ስታቲስቲክስ ማግኘት
  getPropertyStatistics(): Promise<{
    total: number;
    verified: number;
    unverified: number;
    available: number;
    rented: number;
    featured: number;
    averagePrice: number;
    totalViews: number;
    totalFavorites: number;
  }>;
  
  // በአካባቢ ያለውን አማካይ ዋጋ ማግኘት
  getAveragePriceByLocation(regionId?: string, cityId?: string): Promise<number>;
  
  // በቤት አይነት ያለውን አማካይ ዋጋ ማግኘት
  getAveragePriceByPropertyType(propertyType: string): Promise<number>;
  // የቤት ጥያቄ ቆጠራ መጨመር
  incrementPropertyInquiryCount(propertyId: string): Promise<void>;


}