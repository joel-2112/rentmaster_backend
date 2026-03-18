import { Injectable } from '@nestjs/common';
import { RegionEntity } from '../../domain/entities/region.entity';
import { ZoneEntity } from '../../domain/entities/zone.entity';
import { CityEntity } from '../../domain/entities/city.entity';
import { SubcityEntity } from '../../domain/entities/subcity.entity';
import { WoredaEntity } from '../../domain/entities/woreda.entity';
import { KebeleEntity } from '../../domain/entities/kebele.entity';
import { CityType } from '@prisma/client';
import { CreateRegionDto, UpdateRegionDto, RegionResponseDto } from '../dtos/region.dto';
import { CreateZoneDto, UpdateZoneDto, ZoneResponseDto } from '../dtos/zone.dto';
import { CreateCityDto, UpdateCityDto, CityResponseDto } from '../dtos/city.dto';
import { CreateSubcityDto, UpdateSubcityDto, SubcityResponseDto } from '../dtos/subcity.dto';
import { CreateWoredaDto, UpdateWoredaDto, WoredaResponseDto } from '../dtos/woreda.dto';
import { CreateKebeleDto, UpdateKebeleDto, KebeleResponseDto } from '../dtos/kebele.dto';

@Injectable()
export class LocationMapper {
  
  // ==================== Region Mappers ====================
  
  toRegionEntityFromCreate(dto: CreateRegionDto): Partial<RegionEntity> {
    return {
      name: dto.name,
      code: dto.code,
    };
  }

  toRegionEntityFromUpdate(dto: UpdateRegionDto): Partial<RegionEntity> {
    const entity: Partial<RegionEntity> = {};
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.code !== undefined) entity.code = dto.code;
    return entity;
  }

  toRegionResponseDto(entity: RegionEntity): RegionResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toRegionResponseDtoList(entities: RegionEntity[]): RegionResponseDto[] {
    return entities.map(entity => this.toRegionResponseDto(entity));
  }

  // ==================== Zone Mappers ====================

  toZoneEntityFromCreate(dto: CreateZoneDto): Partial<ZoneEntity> {
    return {
      name: dto.name,
      code: dto.code,
      regionId: dto.regionId,
    };
  }

  toZoneEntityFromUpdate(dto: UpdateZoneDto): Partial<ZoneEntity> {
    const entity: Partial<ZoneEntity> = {};
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.code !== undefined) entity.code = dto.code;
    if (dto.regionId !== undefined) entity.regionId = dto.regionId;
    return entity;
  }

  toZoneResponseDto(entity: ZoneEntity, regionName?: string): ZoneResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code || undefined,
      regionId: entity.regionId,
      regionName: regionName,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toZoneResponseDtoList(entities: ZoneEntity[], regionNames?: Map<string, string>): ZoneResponseDto[] {
    return entities.map(entity => 
      this.toZoneResponseDto(
        entity, 
        regionNames?.get(entity.regionId)
      )
    );
  }

  // ==================== City Mappers ====================

  toCityEntityFromCreate(dto: CreateCityDto): Partial<CityEntity> {
    return {
      name: dto.name,
      regionId: dto.regionId,
      zoneId: dto.zoneId,
      cityType: dto.cityType || CityType.CITY,
      municipalityName: dto.municipalityName,
      municipalityPhone: dto.municipalityPhone,
      municipalityEmail: dto.municipalityEmail,
      latitude: dto.latitude,
      longitude: dto.longitude,
      isActive: dto.isActive ?? true,
    };
  }

  toCityEntityFromUpdate(dto: UpdateCityDto): Partial<CityEntity> {
    const entity: Partial<CityEntity> = {};
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.regionId !== undefined) entity.regionId = dto.regionId;
    if (dto.zoneId !== undefined) entity.zoneId = dto.zoneId;
    if (dto.cityType !== undefined) entity.cityType = dto.cityType;
    if (dto.municipalityName !== undefined) entity.municipalityName = dto.municipalityName;
    if (dto.municipalityPhone !== undefined) entity.municipalityPhone = dto.municipalityPhone;
    if (dto.municipalityEmail !== undefined) entity.municipalityEmail = dto.municipalityEmail;
    if (dto.latitude !== undefined) entity.latitude = dto.latitude;
    if (dto.longitude !== undefined) entity.longitude = dto.longitude;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    return entity;
  }

  toCityResponseDto(
    entity: CityEntity, 
    regionName?: string, 
    zoneName?: string
  ): CityResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      regionId: entity.regionId,
      regionName: regionName,
      zoneId: entity.zoneId || undefined,
      zoneName: zoneName,
      cityType: entity.cityType,
      municipalityName: entity.municipalityName || undefined,
      municipalityPhone: entity.municipalityPhone || undefined,
      municipalityEmail: entity.municipalityEmail || undefined,
      latitude: entity.latitude || undefined,
      longitude: entity.longitude || undefined,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toCityResponseDtoList(
    entities: CityEntity[], 
    regionNames?: Map<string, string>,
    zoneNames?: Map<string, string>
  ): CityResponseDto[] {
    return entities.map(entity => 
      this.toCityResponseDto(
        entity, 
        regionNames?.get(entity.regionId),
        entity.zoneId ? zoneNames?.get(entity.zoneId) : undefined
      )
    );
  }

  // ==================== Subcity Mappers ====================

  toSubcityEntityFromCreate(dto: CreateSubcityDto): Partial<SubcityEntity> {
    return {
      name: dto.name,
      code: dto.code,
      cityId: dto.cityId,
      officeName: dto.officeName,
      officePhone: dto.officePhone,
      officeEmail: dto.officeEmail,
      latitude: dto.latitude,
      longitude: dto.longitude,
      isActive: dto.isActive ?? true,
    };
  }

  toSubcityEntityFromUpdate(dto: UpdateSubcityDto): Partial<SubcityEntity> {
    const entity: Partial<SubcityEntity> = {};
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.code !== undefined) entity.code = dto.code;
    if (dto.cityId !== undefined) entity.cityId = dto.cityId;
    if (dto.officeName !== undefined) entity.officeName = dto.officeName;
    if (dto.officePhone !== undefined) entity.officePhone = dto.officePhone;
    if (dto.officeEmail !== undefined) entity.officeEmail = dto.officeEmail;
    if (dto.latitude !== undefined) entity.latitude = dto.latitude;
    if (dto.longitude !== undefined) entity.longitude = dto.longitude;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    return entity;
  }

  toSubcityResponseDto(
    entity: SubcityEntity, 
    cityName?: string
  ): SubcityResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code || undefined,
      cityId: entity.cityId,
      cityName: cityName,
      officeName: entity.officeName || undefined,
      officePhone: entity.officePhone || undefined,
      officeEmail: entity.officeEmail || undefined,
      latitude: entity.latitude || undefined,
      longitude: entity.longitude || undefined,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toSubcityResponseDtoList(
    entities: SubcityEntity[], 
    cityNames?: Map<string, string>
  ): SubcityResponseDto[] {
    return entities.map(entity => 
      this.toSubcityResponseDto(
        entity, 
        cityNames?.get(entity.cityId)
      )
    );
  }

  // ==================== Woreda Mappers ====================

  toWoredaEntityFromCreate(dto: CreateWoredaDto): Partial<WoredaEntity> {
    return {
      name: dto.name,
      number: dto.number,
      regionId: dto.regionId,
      zoneId: dto.zoneId,
      cityId: dto.cityId,
      subcityId: dto.subcityId,
      officeName: dto.officeName,
      officePhone: dto.officePhone,
      officeEmail: dto.officeEmail,
      population: dto.population,
      area: dto.area,
      latitude: dto.latitude,
      longitude: dto.longitude,
      isActive: dto.isActive ?? true,
    };
  }

  toWoredaEntityFromUpdate(dto: UpdateWoredaDto): Partial<WoredaEntity> {
    const entity: Partial<WoredaEntity> = {};
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.number !== undefined) entity.number = dto.number;
    if (dto.regionId !== undefined) entity.regionId = dto.regionId;
    if (dto.zoneId !== undefined) entity.zoneId = dto.zoneId;
    if (dto.cityId !== undefined) entity.cityId = dto.cityId;
    if (dto.subcityId !== undefined) entity.subcityId = dto.subcityId;
    if (dto.officeName !== undefined) entity.officeName = dto.officeName;
    if (dto.officePhone !== undefined) entity.officePhone = dto.officePhone;
    if (dto.officeEmail !== undefined) entity.officeEmail = dto.officeEmail;
    if (dto.population !== undefined) entity.population = dto.population;
    if (dto.area !== undefined) entity.area = dto.area;
    if (dto.latitude !== undefined) entity.latitude = dto.latitude;
    if (dto.longitude !== undefined) entity.longitude = dto.longitude;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    return entity;
  }

  toWoredaResponseDto(
    entity: WoredaEntity,
    regionName?: string,
    zoneName?: string,
    cityName?: string,
    subcityName?: string
  ): WoredaResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      number: entity.number || undefined,
      regionId: entity.regionId,
      regionName: regionName,
      zoneId: entity.zoneId || undefined,
      zoneName: zoneName,
      cityId: entity.cityId || undefined,
      cityName: cityName,
      subcityId: entity.subcityId || undefined,
      subcityName: subcityName,
      officeName: entity.officeName || undefined,
      officePhone: entity.officePhone || undefined,
      officeEmail: entity.officeEmail || undefined,
      population: entity.population || undefined,
      area: entity.area || undefined,
      latitude: entity.latitude || undefined,
      longitude: entity.longitude || undefined,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toWoredaResponseDtoList(
    entities: WoredaEntity[],
    regionNames?: Map<string, string>,
    zoneNames?: Map<string, string>,
    cityNames?: Map<string, string>,
    subcityNames?: Map<string, string>
  ): WoredaResponseDto[] {
    return entities.map(entity => 
      this.toWoredaResponseDto(
        entity,
        regionNames?.get(entity.regionId),
        entity.zoneId ? zoneNames?.get(entity.zoneId) : undefined,
        entity.cityId ? cityNames?.get(entity.cityId) : undefined,
        entity.subcityId ? subcityNames?.get(entity.subcityId) : undefined
      )
    );
  }

  // ==================== Kebele Mappers ====================

  toKebeleEntityFromCreate(dto: CreateKebeleDto): Partial<KebeleEntity> {
    return {
      name: dto.name,
      number: dto.number,
      regionId: dto.regionId,
      zoneId: dto.zoneId,
      cityId: dto.cityId,
      subcityId: dto.subcityId,
      woredaId: dto.woredaId,
      officeName: dto.officeName,
      officePhone: dto.officePhone,
      officeEmail: dto.officeEmail,
      officialName: dto.officialName,
      officialTitle: dto.officialTitle,
      officialPhone: dto.officialPhone,
      population: dto.population,
      area: dto.area,
      sealImage: dto.sealImage,
      sealCode: dto.sealCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      isActive: dto.isActive ?? true,
      hasDigitalSeal: dto.hasDigitalSeal ?? false,
    };
  }

  toKebeleEntityFromUpdate(dto: UpdateKebeleDto): Partial<KebeleEntity> {
    const entity: Partial<KebeleEntity> = {};
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.number !== undefined) entity.number = dto.number;
    if (dto.regionId !== undefined) entity.regionId = dto.regionId;
    if (dto.zoneId !== undefined) entity.zoneId = dto.zoneId;
    if (dto.cityId !== undefined) entity.cityId = dto.cityId;
    if (dto.subcityId !== undefined) entity.subcityId = dto.subcityId;
    if (dto.woredaId !== undefined) entity.woredaId = dto.woredaId;
    if (dto.officeName !== undefined) entity.officeName = dto.officeName;
    if (dto.officePhone !== undefined) entity.officePhone = dto.officePhone;
    if (dto.officeEmail !== undefined) entity.officeEmail = dto.officeEmail;
    if (dto.officialName !== undefined) entity.officialName = dto.officialName;
    if (dto.officialTitle !== undefined) entity.officialTitle = dto.officialTitle;
    if (dto.officialPhone !== undefined) entity.officialPhone = dto.officialPhone;
    if (dto.population !== undefined) entity.population = dto.population;
    if (dto.area !== undefined) entity.area = dto.area;
    if (dto.sealImage !== undefined) entity.sealImage = dto.sealImage;
    if (dto.sealCode !== undefined) entity.sealCode = dto.sealCode;
    if (dto.latitude !== undefined) entity.latitude = dto.latitude;
    if (dto.longitude !== undefined) entity.longitude = dto.longitude;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.hasDigitalSeal !== undefined) entity.hasDigitalSeal = dto.hasDigitalSeal;
    return entity;
  }

  toKebeleResponseDto(
    entity: KebeleEntity,
    regionName?: string,
    zoneName?: string,
    cityName?: string,
    subcityName?: string,
    woredaName?: string
  ): KebeleResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      number: entity.number || undefined,
      regionId: entity.regionId,
      regionName: regionName,
      zoneId: entity.zoneId || undefined,
      zoneName: zoneName,
      cityId: entity.cityId || undefined,
      cityName: cityName,
      subcityId: entity.subcityId || undefined,
      subcityName: subcityName,
      woredaId: entity.woredaId || undefined,
      woredaName: woredaName,
      officeName: entity.officeName || undefined,
      officePhone: entity.officePhone || undefined,
      officeEmail: entity.officeEmail || undefined,
      officialName: entity.officialName || undefined,
      officialTitle: entity.officialTitle || undefined,
      officialPhone: entity.officialPhone || undefined,
      population: entity.population || undefined,
      area: entity.area || undefined,
      sealImage: entity.sealImage || undefined,
      sealCode: entity.sealCode || undefined,
      latitude: entity.latitude || undefined,
      longitude: entity.longitude || undefined,
      isActive: entity.isActive,
      hasDigitalSeal: entity.hasDigitalSeal,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toKebeleResponseDtoList(
    entities: KebeleEntity[],
    regionNames?: Map<string, string>,
    zoneNames?: Map<string, string>,
    cityNames?: Map<string, string>,
    subcityNames?: Map<string, string>,
    woredaNames?: Map<string, string>
  ): KebeleResponseDto[] {
    return entities.map(entity => 
      this.toKebeleResponseDto(
        entity,
        regionNames?.get(entity.regionId),
        entity.zoneId ? zoneNames?.get(entity.zoneId) : undefined,
        entity.cityId ? cityNames?.get(entity.cityId) : undefined,
        entity.subcityId ? subcityNames?.get(entity.subcityId) : undefined,
        entity.woredaId ? woredaNames?.get(entity.woredaId) : undefined
      )
    );
  }
}