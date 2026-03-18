import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import type { ILocationRepository } from '../../domain/ports/repositories/location.repository.interface';
import { LocationMapper } from '../mappers/location.mapper';

// DTOs
import { CreateRegionDto, UpdateRegionDto, RegionResponseDto } from '../dtos/region.dto';
import { CreateZoneDto, UpdateZoneDto, ZoneResponseDto } from '../dtos/zone.dto';
import { CreateCityDto, UpdateCityDto, CityResponseDto } from '../dtos/city.dto';
import { CreateSubcityDto, UpdateSubcityDto, SubcityResponseDto } from '../dtos/subcity.dto';
import { CreateWoredaDto, UpdateWoredaDto, WoredaResponseDto } from '../dtos/woreda.dto';
import { CreateKebeleDto, UpdateKebeleDto, KebeleResponseDto } from '../dtos/kebele.dto';

@Injectable()
export class LocationUseCase {
  constructor(
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
    private readonly locationMapper: LocationMapper,
  ) {}

  // ==================== Region Methods ====================

  // አዲስ ክልል መፍጠር
  async createRegion(createRegionDto: CreateRegionDto): Promise<RegionResponseDto> {
    // ክልሉ በስም አስቀድሞ መኖሩን አረጋግጥ
    const existingRegion = await this.locationRepository.getRegionByName(createRegionDto.name);
    if (existingRegion) {
      throw new ConflictException(`ክልል '${createRegionDto.name}' አስቀድሞ ተመዝግቧል`);
    }

    // ክልሉ በኮድ አስቀድሞ መኖሩን አረጋግጥ
    const existingRegionByCode = await this.locationRepository.getRegionByCode(createRegionDto.code);
    if (existingRegionByCode) {
      throw new ConflictException(`የክልል ኮድ '${createRegionDto.code}' አስቀድሞ ተመዝግቧል`);
    }

    const regionEntity = this.locationMapper.toRegionEntityFromCreate(createRegionDto);
    const newRegion = await this.locationRepository.createRegion(regionEntity);
    return this.locationMapper.toRegionResponseDto(newRegion);
  }

  // ክልል በID ማግኘት
  async getRegionById(id: string): Promise<RegionResponseDto> {
    const region = await this.locationRepository.getRegionById(id);
    if (!region) {
      throw new NotFoundException(`ክልል በID '${id}' አልተገኘም`);
    }
    return this.locationMapper.toRegionResponseDto(region);
  }

  // ክልል በስም ማግኘት
  async getRegionByName(name: string): Promise<RegionResponseDto> {
    const region = await this.locationRepository.getRegionByName(name);
    if (!region) {
      throw new NotFoundException(`ክልል '${name}' አልተገኘም`);
    }
    return this.locationMapper.toRegionResponseDto(region);
  }

  // ክልል በኮድ ማግኘት
  async getRegionByCode(code: string): Promise<RegionResponseDto> {
    const region = await this.locationRepository.getRegionByCode(code);
    if (!region) {
      throw new NotFoundException(`ክልል ኮድ '${code}' አልተገኘም`);
    }
    return this.locationMapper.toRegionResponseDto(region);
  }

  // ሁሉንም ክልሎች ማግኘት
  async getAllRegions(): Promise<RegionResponseDto[]> {
    const regions = await this.locationRepository.getAllRegions();
    return this.locationMapper.toRegionResponseDtoList(regions);
  }

  // ንቁ የሆኑ ክልሎችን ማግኘት
  async getActiveRegions(): Promise<RegionResponseDto[]> {
    const regions = await this.locationRepository.getActiveRegions();
    return this.locationMapper.toRegionResponseDtoList(regions);
  }

  // ክልል ማዘመን
  async updateRegion(id: string, updateRegionDto: UpdateRegionDto): Promise<RegionResponseDto> {
    // ክልሉ መኖሩን አረጋግጥ
    const regionExists = await this.locationRepository.regionExists(id);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${id}' አልተገኘም`);
    }

    // ስም እየተቀየረ ከሆነ አዲሱ ስም አስቀድሞ አለመኖሩን አረጋግጥ
    if (updateRegionDto.name) {
      const existingRegion = await this.locationRepository.getRegionByName(updateRegionDto.name);
      if (existingRegion && existingRegion.id !== id) {
        throw new ConflictException(`ክልል '${updateRegionDto.name}' አስቀድሞ ተመዝግቧል`);
      }
    }

    // ኮድ እየተቀየረ ከሆነ አዲሱ ኮድ አስቀድሞ አለመኖሩን አረጋግጥ
    if (updateRegionDto.code) {
      const existingRegionByCode = await this.locationRepository.getRegionByCode(updateRegionDto.code);
      if (existingRegionByCode && existingRegionByCode.id !== id) {
        throw new ConflictException(`የክልል ኮድ '${updateRegionDto.code}' አስቀድሞ ተመዝግቧል`);
      }
    }

    const regionEntity = this.locationMapper.toRegionEntityFromUpdate(updateRegionDto);
    const updatedRegion = await this.locationRepository.updateRegion(id, regionEntity);
    return this.locationMapper.toRegionResponseDto(updatedRegion);
  }

  // ክልል መሰረዝ (ለስላሳ ሰርዝ)
  async softDeleteRegion(id: string): Promise<RegionResponseDto> {
    const regionExists = await this.locationRepository.regionExists(id);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${id}' አልተገኘም`);
    }

    const deletedRegion = await this.locationRepository.softDeleteRegion(id);
    return this.locationMapper.toRegionResponseDto(deletedRegion);
  }

  // ክልል ሙሉ በሙሉ መሰረዝ
  async hardDeleteRegion(id: string): Promise<void> {
    const regionExists = await this.locationRepository.regionExists(id);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${id}' አልተገኘም`);
    }

    await this.locationRepository.hardDeleteRegion(id);
  }

  // ==================== Zone Methods ====================

  // አዲስ ዞን መፍጠር
  async createZone(createZoneDto: CreateZoneDto): Promise<ZoneResponseDto> {
    // ክልሉ መኖሩን አረጋግጥ
    const regionExists = await this.locationRepository.regionExists(createZoneDto.regionId);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${createZoneDto.regionId}' አልተገኘም`);
    }

    // ዞኑ በስም እና በክልል አስቀድሞ መኖሩን አረጋግጥ
    const existingZone = await this.locationRepository.getZoneByNameAndRegion(
      createZoneDto.name,
      createZoneDto.regionId
    );
    if (existingZone) {
      throw new ConflictException(`ዞን '${createZoneDto.name}' በዚህ ክልል አስቀድሞ ተመዝግቧል`);
    }

    const zoneEntity = this.locationMapper.toZoneEntityFromCreate(createZoneDto);
    const newZone = await this.locationRepository.createZone(zoneEntity);
    
    // የክልል ስም ለማግኘት
    const region = await this.locationRepository.getRegionById(newZone.regionId);
    return this.locationMapper.toZoneResponseDto(newZone, region?.name);
  }

  // ዞን በID ማግኘት
  async getZoneById(id: string): Promise<ZoneResponseDto> {
    const zone = await this.locationRepository.getZoneById(id);
    if (!zone) {
      throw new NotFoundException(`ዞን በID '${id}' አልተገኘም`);
    }
    
    const region = zone.regionId ? await this.locationRepository.getRegionById(zone.regionId) : null;
    return this.locationMapper.toZoneResponseDto(zone, region?.name);
  }

  // በክልል የሚገኙ ዞኖችን ማግኘት
  async getZonesByRegion(regionId: string): Promise<ZoneResponseDto[]> {
    const regionExists = await this.locationRepository.regionExists(regionId);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${regionId}' አልተገኘም`);
    }

    const zones = await this.locationRepository.getZonesByRegion(regionId);
    
    // የክልል ስሞችን ለማግኘት
    const regionNames = new Map<string, string>();
    const region = await this.locationRepository.getRegionById(regionId);
    if (region) {
      regionNames.set(regionId, region.name);
    }
    
    return this.locationMapper.toZoneResponseDtoList(zones, regionNames);
  }

  // ሁሉንም ዞኖች ማግኘት
  async getAllZones(): Promise<ZoneResponseDto[]> {
    const zones = await this.locationRepository.getAllZones();
    
    // የክልል ስሞችን ለማግኘት
    const regionNames = new Map<string, string>();
    for (const zone of zones) {
      if (zone.regionId && !regionNames.has(zone.regionId)) {
        const region = await this.locationRepository.getRegionById(zone.regionId);
        if (region) {
          regionNames.set(zone.regionId, region.name);
        }
      }
    }
    
    return this.locationMapper.toZoneResponseDtoList(zones, regionNames);
  }

  // ዞን ማዘመን
  async updateZone(id: string, updateZoneDto: UpdateZoneDto): Promise<ZoneResponseDto> {
    // ዞኑ መኖሩን አረጋግጥ
    const zoneExists = await this.locationRepository.zoneExists(id);
    if (!zoneExists) {
      throw new NotFoundException(`ዞን በID '${id}' አልተገኘም`);
    }

    // ክልል እየተቀየረ ከሆነ አዲሱ ክልል መኖሩን አረጋግጥ
    if (updateZoneDto.regionId) {
      const regionExists = await this.locationRepository.regionExists(updateZoneDto.regionId);
      if (!regionExists) {
        throw new NotFoundException(`ክልል በID '${updateZoneDto.regionId}' አልተገኘም`);
      }
    }

    // ስም እየተቀየረ ከሆነ አዲሱ ስም አስቀድሞ አለመኖሩን አረጋግጥ
    if (updateZoneDto.name && updateZoneDto.regionId) {
      const existingZone = await this.locationRepository.getZoneByNameAndRegion(
        updateZoneDto.name,
        updateZoneDto.regionId
      );
      if (existingZone && existingZone.id !== id) {
        throw new ConflictException(`ዞን '${updateZoneDto.name}' በዚህ ክልል አስቀድሞ ተመዝግቧል`);
      }
    }

    const zoneEntity = this.locationMapper.toZoneEntityFromUpdate(updateZoneDto);
    const updatedZone = await this.locationRepository.updateZone(id, zoneEntity);
    
    const region = updatedZone.regionId ? await this.locationRepository.getRegionById(updatedZone.regionId) : null;
    return this.locationMapper.toZoneResponseDto(updatedZone, region?.name);
  }

  // ዞን መሰረዝ
  async softDeleteZone(id: string): Promise<ZoneResponseDto> {
    const zoneExists = await this.locationRepository.zoneExists(id);
    if (!zoneExists) {
      throw new NotFoundException(`ዞን በID '${id}' አልተገኘም`);
    }

    const deletedZone = await this.locationRepository.softDeleteZone(id);
    const region = deletedZone.regionId ? await this.locationRepository.getRegionById(deletedZone.regionId) : null;
    return this.locationMapper.toZoneResponseDto(deletedZone, region?.name);
  }

  // ዞን ሙሉ በሙሉ መሰረዝ
  async hardDeleteZone(id: string): Promise<void> {
    const zoneExists = await this.locationRepository.zoneExists(id);
    if (!zoneExists) {
      throw new NotFoundException(`ዞን በID '${id}' አልተገኘም`);
    }

    await this.locationRepository.hardDeleteZone(id);
  }

  // ==================== City Methods ====================

  // አዲስ ከተማ መፍጠር
  async createCity(createCityDto: CreateCityDto): Promise<CityResponseDto> {
    // ክልሉ መኖሩን አረጋግጥ
    const regionExists = await this.locationRepository.regionExists(createCityDto.regionId);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${createCityDto.regionId}' አልተገኘም`);
    }

    // ዞን ከተጠቀሰ መኖሩን አረጋግጥ
    if (createCityDto.zoneId) {
      const zoneExists = await this.locationRepository.zoneExists(createCityDto.zoneId);
      if (!zoneExists) {
        throw new NotFoundException(`ዞን በID '${createCityDto.zoneId}' አልተገኘም`);
      }
    }

    // ከተማዋ በስም እና በክልል አስቀድሞ መኖሩን አረጋግጥ
    const existingCity = await this.locationRepository.getCityByNameAndRegion(
      createCityDto.name,
      createCityDto.regionId
    );
    if (existingCity) {
      throw new ConflictException(`ከተማ '${createCityDto.name}' በዚህ ክልል አስቀድሞ ተመዝግቧል`);
    }

    const cityEntity = this.locationMapper.toCityEntityFromCreate(createCityDto);
    const newCity = await this.locationRepository.createCity(cityEntity);
    
    const region = await this.locationRepository.getRegionById(newCity.regionId);
    const zone = newCity.zoneId ? await this.locationRepository.getZoneById(newCity.zoneId) : null;
    
    return this.locationMapper.toCityResponseDto(
      newCity, 
      region?.name, 
      zone?.name
    );
  }

  // ከተማ በID ማግኘት
  async getCityById(id: string): Promise<CityResponseDto> {
    const city = await this.locationRepository.getCityById(id);
    if (!city) {
      throw new NotFoundException(`ከተማ በID '${id}' አልተገኘም`);
    }
    
    const region = city.regionId ? await this.locationRepository.getRegionById(city.regionId) : null;
    const zone = city.zoneId ? await this.locationRepository.getZoneById(city.zoneId) : null;
    
    return this.locationMapper.toCityResponseDto(city, region?.name, zone?.name);
  }

  // በክልል የሚገኙ ከተሞችን ማግኘት
  async getCitiesByRegion(regionId: string): Promise<CityResponseDto[]> {
    const regionExists = await this.locationRepository.regionExists(regionId);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${regionId}' አልተገኘም`);
    }

    const cities = await this.locationRepository.getCitiesByRegion(regionId);
    
    // የክልል እና የዞን ስሞችን ለማግኘት
    const regionNames = new Map<string, string>();
    const zoneNames = new Map<string, string>();
    
    const region = await this.locationRepository.getRegionById(regionId);
    if (region) {
      regionNames.set(regionId, region.name);
    }
    
    for (const city of cities) {
      if (city.zoneId && !zoneNames.has(city.zoneId)) {
        const zone = await this.locationRepository.getZoneById(city.zoneId);
        if (zone) {
          zoneNames.set(city.zoneId, zone.name);
        }
      }
    }
    
    return this.locationMapper.toCityResponseDtoList(cities, regionNames, zoneNames);
  }

  // በዞን የሚገኙ ከተሞችን ማግኘት
  async getCitiesByZone(zoneId: string): Promise<CityResponseDto[]> {
    const zoneExists = await this.locationRepository.zoneExists(zoneId);
    if (!zoneExists) {
      throw new NotFoundException(`ዞን በID '${zoneId}' አልተገኘም`);
    }

    const cities = await this.locationRepository.getCitiesByZone(zoneId);
    
    // የክልል እና የዞን ስሞችን ለማግኘት
    const regionNames = new Map<string, string>();
    const zoneNames = new Map<string, string>();
    
    const zone = await this.locationRepository.getZoneById(zoneId);
    if (zone) {
      zoneNames.set(zoneId, zone.name);
      if (zone.regionId) {
        const region = await this.locationRepository.getRegionById(zone.regionId);
        if (region) {
          regionNames.set(zone.regionId, region.name);
        }
      }
    }
    
    return this.locationMapper.toCityResponseDtoList(cities, regionNames, zoneNames);
  }

  // ሁሉንም ከተሞች ማግኘት
  async getAllCities(): Promise<CityResponseDto[]> {
    const cities = await this.locationRepository.getAllCities();
    
    // የክልል እና የዞን ስሞችን ለማግኘት
    const regionNames = new Map<string, string>();
    const zoneNames = new Map<string, string>();
    
    for (const city of cities) {
      if (city.regionId && !regionNames.has(city.regionId)) {
        const region = await this.locationRepository.getRegionById(city.regionId);
        if (region) {
          regionNames.set(city.regionId, region.name);
        }
      }
      if (city.zoneId && !zoneNames.has(city.zoneId)) {
        const zone = await this.locationRepository.getZoneById(city.zoneId);
        if (zone) {
          zoneNames.set(city.zoneId, zone.name);
        }
      }
    }
    
    return this.locationMapper.toCityResponseDtoList(cities, regionNames, zoneNames);
  }

  // ንቁ የሆኑ ከተሞችን ማግኘት
  async getActiveCities(): Promise<CityResponseDto[]> {
    const cities = await this.locationRepository.getActiveCities();
    
    // የክልል እና የዞን ስሞችን ለማግኘት
    const regionNames = new Map<string, string>();
    const zoneNames = new Map<string, string>();
    
    for (const city of cities) {
      if (city.regionId && !regionNames.has(city.regionId)) {
        const region = await this.locationRepository.getRegionById(city.regionId);
        if (region) {
          regionNames.set(city.regionId, region.name);
        }
      }
      if (city.zoneId && !zoneNames.has(city.zoneId)) {
        const zone = await this.locationRepository.getZoneById(city.zoneId);
        if (zone) {
          zoneNames.set(city.zoneId, zone.name);
        }
      }
    }
    
    return this.locationMapper.toCityResponseDtoList(cities, regionNames, zoneNames);
  }

  // ከተማ ማዘመን
  async updateCity(id: string, updateCityDto: UpdateCityDto): Promise<CityResponseDto> {
    // ከተማዋ መኖሯን አረጋግጥ
    const cityExists = await this.locationRepository.cityExists(id);
    if (!cityExists) {
      throw new NotFoundException(`ከተማ በID '${id}' አልተገኘም`);
    }

    // ክልል እየተቀየረ ከሆነ አዲሱ ክልል መኖሩን አረጋግጥ
    if (updateCityDto.regionId) {
      const regionExists = await this.locationRepository.regionExists(updateCityDto.regionId);
      if (!regionExists) {
        throw new NotFoundException(`ክልል በID '${updateCityDto.regionId}' አልተገኘም`);
      }
    }

    // ዞን እየተቀየረ ከሆነ አዲሱ ዞን መኖሩን አረጋግጥ
    if (updateCityDto.zoneId) {
      const zoneExists = await this.locationRepository.zoneExists(updateCityDto.zoneId);
      if (!zoneExists) {
        throw new NotFoundException(`ዞን በID '${updateCityDto.zoneId}' አልተገኘም`);
      }
    }

    const cityEntity = this.locationMapper.toCityEntityFromUpdate(updateCityDto);
    const updatedCity = await this.locationRepository.updateCity(id, cityEntity);
    
    const region = updatedCity.regionId ? await this.locationRepository.getRegionById(updatedCity.regionId) : null;
    const zone = updatedCity.zoneId ? await this.locationRepository.getZoneById(updatedCity.zoneId) : null;
    
    return this.locationMapper.toCityResponseDto(updatedCity, region?.name, zone?.name);
  }

  // ከተማ ለስላሳ ሰርዝ
  async softDeleteCity(id: string): Promise<CityResponseDto> {
    const cityExists = await this.locationRepository.cityExists(id);
    if (!cityExists) {
      throw new NotFoundException(`ከተማ በID '${id}' አልተገኘም`);
    }

    const deletedCity = await this.locationRepository.softDeleteCity(id);
    
    const region = deletedCity.regionId ? await this.locationRepository.getRegionById(deletedCity.regionId) : null;
    const zone = deletedCity.zoneId ? await this.locationRepository.getZoneById(deletedCity.zoneId) : null;
    
    return this.locationMapper.toCityResponseDto(deletedCity, region?.name, zone?.name);
  }

  // ከተማ ሙሉ በሙሉ መሰረዝ
  async hardDeleteCity(id: string): Promise<void> {
    const cityExists = await this.locationRepository.cityExists(id);
    if (!cityExists) {
      throw new NotFoundException(`ከተማ በID '${id}' አልተገኘም`);
    }

    await this.locationRepository.hardDeleteCity(id);
  }

  // ==================== Subcity Methods ====================

  // አዲስ ክፍለ ከተማ መፍጠር
  async createSubcity(createSubcityDto: CreateSubcityDto): Promise<SubcityResponseDto> {
    // ከተማዋ መኖሯን አረጋግጥ
    const cityExists = await this.locationRepository.cityExists(createSubcityDto.cityId);
    if (!cityExists) {
      throw new NotFoundException(`ከተማ በID '${createSubcityDto.cityId}' አልተገኘም`);
    }

    // ክፍለ ከተማው በስም እና በከተማ አስቀድሞ መኖሩን አረጋግጥ
    const existingSubcity = await this.locationRepository.getSubcityByNameAndCity(
      createSubcityDto.name,
      createSubcityDto.cityId
    );
    if (existingSubcity) {
      throw new ConflictException(`ክፍለ ከተማ '${createSubcityDto.name}' በዚህ ከተማ አስቀድሞ ተመዝግቧል`);
    }

    const subcityEntity = this.locationMapper.toSubcityEntityFromCreate(createSubcityDto);
    const newSubcity = await this.locationRepository.createSubcity(subcityEntity);
    
    const city = await this.locationRepository.getCityById(newSubcity.cityId);
    
    return this.locationMapper.toSubcityResponseDto(newSubcity, city?.name);
  }

  // ክፍለ ከተማ በID ማግኘት
  async getSubcityById(id: string): Promise<SubcityResponseDto> {
    const subcity = await this.locationRepository.getSubcityById(id);
    if (!subcity) {
      throw new NotFoundException(`ክፍለ ከተማ በID '${id}' አልተገኘም`);
    }
    
    const city = subcity.cityId ? await this.locationRepository.getCityById(subcity.cityId) : null;
    
    return this.locationMapper.toSubcityResponseDto(subcity, city?.name);
  }

  // በከተማ የሚገኙ ክፍለ ከተሞችን ማግኘት
  async getSubcitiesByCity(cityId: string): Promise<SubcityResponseDto[]> {
    const cityExists = await this.locationRepository.cityExists(cityId);
    if (!cityExists) {
      throw new NotFoundException(`ከተማ በID '${cityId}' አልተገኘም`);
    }

    const subcities = await this.locationRepository.getSubcitiesByCity(cityId);
    
    // የከተማ ስሞችን ለማግኘት
    const cityNames = new Map<string, string>();
    const city = await this.locationRepository.getCityById(cityId);
    if (city) {
      cityNames.set(cityId, city.name);
    }
    
    return this.locationMapper.toSubcityResponseDtoList(subcities, cityNames);
  }

  // ሁሉንም ክፍለ ከተሞች ማግኘት
  async getAllSubcities(): Promise<SubcityResponseDto[]> {
    const subcities = await this.locationRepository.getAllSubcities();
    
    // የከተማ ስሞችን ለማግኘት
    const cityNames = new Map<string, string>();
    for (const subcity of subcities) {
      if (subcity.cityId && !cityNames.has(subcity.cityId)) {
        const city = await this.locationRepository.getCityById(subcity.cityId);
        if (city) {
          cityNames.set(subcity.cityId, city.name);
        }
      }
    }
    
    return this.locationMapper.toSubcityResponseDtoList(subcities, cityNames);
  }

  // ክፍለ ከተማ ማዘመን
  async updateSubcity(id: string, updateSubcityDto: UpdateSubcityDto): Promise<SubcityResponseDto> {
    // ክፍለ ከተማው መኖሩን አረጋግጥ
    const subcityExists = await this.locationRepository.subcityExists(id);
    if (!subcityExists) {
      throw new NotFoundException(`ክፍለ ከተማ በID '${id}' አልተገኘም`);
    }

    // ከተማ እየተቀየረ ከሆነ አዲሷ ከተማ መኖሯን አረጋግጥ
    if (updateSubcityDto.cityId) {
      const cityExists = await this.locationRepository.cityExists(updateSubcityDto.cityId);
      if (!cityExists) {
        throw new NotFoundException(`ከተማ በID '${updateSubcityDto.cityId}' አልተገኘም`);
      }
    }

    const subcityEntity = this.locationMapper.toSubcityEntityFromUpdate(updateSubcityDto);
    const updatedSubcity = await this.locationRepository.updateSubcity(id, subcityEntity);
    
    const city = updatedSubcity.cityId ? await this.locationRepository.getCityById(updatedSubcity.cityId) : null;
    
    return this.locationMapper.toSubcityResponseDto(updatedSubcity, city?.name);
  }

  // ክፍለ ከተማ ለስላሳ ሰርዝ
  async softDeleteSubcity(id: string): Promise<SubcityResponseDto> {
    const subcityExists = await this.locationRepository.subcityExists(id);
    if (!subcityExists) {
      throw new NotFoundException(`ክፍለ ከተማ በID '${id}' አልተገኘም`);
    }

    const deletedSubcity = await this.locationRepository.softDeleteSubcity(id);
    
    const city = deletedSubcity.cityId ? await this.locationRepository.getCityById(deletedSubcity.cityId) : null;
    
    return this.locationMapper.toSubcityResponseDto(deletedSubcity, city?.name);
  }

  // ክፍለ ከተማ ሙሉ በሙሉ መሰረዝ
  async hardDeleteSubcity(id: string): Promise<void> {
    const subcityExists = await this.locationRepository.subcityExists(id);
    if (!subcityExists) {
      throw new NotFoundException(`ክፍለ ከተማ በID '${id}' አልተገኘም`);
    }

    await this.locationRepository.hardDeleteSubcity(id);
  }

  // ==================== Woreda Methods ====================

  // አዲስ ወረዳ መፍጠር
  async createWoreda(createWoredaDto: CreateWoredaDto): Promise<WoredaResponseDto> {
    // ክልሉ መኖሩን አረጋግጥ
    const regionExists = await this.locationRepository.regionExists(createWoredaDto.regionId);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${createWoredaDto.regionId}' አልተገኘም`);
    }

    // ዞን ከተጠቀሰ መኖሩን አረጋግጥ
    if (createWoredaDto.zoneId) {
      const zoneExists = await this.locationRepository.zoneExists(createWoredaDto.zoneId);
      if (!zoneExists) {
        throw new NotFoundException(`ዞን በID '${createWoredaDto.zoneId}' አልተገኘም`);
      }
    }

    // ከተማ ከተጠቀሰ መኖሯን አረጋግጥ
    if (createWoredaDto.cityId) {
      const cityExists = await this.locationRepository.cityExists(createWoredaDto.cityId);
      if (!cityExists) {
        throw new NotFoundException(`ከተማ በID '${createWoredaDto.cityId}' አልተገኘም`);
      }
    }

    // ክፍለ ከተማ ከተጠቀሰ መኖሩን አረጋግጥ
    if (createWoredaDto.subcityId) {
      const subcityExists = await this.locationRepository.subcityExists(createWoredaDto.subcityId);
      if (!subcityExists) {
        throw new NotFoundException(`ክፍለ ከተማ በID '${createWoredaDto.subcityId}' አልተገኘም`);
      }
    }

    // ወረዳው በስም እና በክልል አስቀድሞ መኖሩን አረጋግጥ
    const existingWoreda = await this.locationRepository.getWoredaByNameAndRegion(
      createWoredaDto.name,
      createWoredaDto.regionId
    );
    if (existingWoreda) {
      throw new ConflictException(`ወረዳ '${createWoredaDto.name}' በዚህ ክልል አስቀድሞ ተመዝግቧል`);
    }

    const woredaEntity = this.locationMapper.toWoredaEntityFromCreate(createWoredaDto);
    const newWoreda = await this.locationRepository.createWoreda(woredaEntity);
    
    const region = await this.locationRepository.getRegionById(newWoreda.regionId);
    const zone = newWoreda.zoneId ? await this.locationRepository.getZoneById(newWoreda.zoneId) : null;
    const city = newWoreda.cityId ? await this.locationRepository.getCityById(newWoreda.cityId) : null;
    const subcity = newWoreda.subcityId ? await this.locationRepository.getSubcityById(newWoreda.subcityId) : null;
    
    return this.locationMapper.toWoredaResponseDto(
      newWoreda,
      region?.name,
      zone?.name,
      city?.name,
      subcity?.name
    );
  }

  // ወረዳ በID ማግኘት
  async getWoredaById(id: string): Promise<WoredaResponseDto> {
    const woreda = await this.locationRepository.getWoredaById(id);
    if (!woreda) {
      throw new NotFoundException(`ወረዳ በID '${id}' አልተገኘም`);
    }
    
    const region = woreda.regionId ? await this.locationRepository.getRegionById(woreda.regionId) : null;
    const zone = woreda.zoneId ? await this.locationRepository.getZoneById(woreda.zoneId) : null;
    const city = woreda.cityId ? await this.locationRepository.getCityById(woreda.cityId) : null;
    const subcity = woreda.subcityId ? await this.locationRepository.getSubcityById(woreda.subcityId) : null;
    
    return this.locationMapper.toWoredaResponseDto(
      woreda,
      region?.name,
      zone?.name,
      city?.name,
      subcity?.name
    );
  }

  // በክልል የሚገኙ ወረዳዎችን ማግኘት
  async getWoredasByRegion(regionId: string): Promise<WoredaResponseDto[]> {
    const regionExists = await this.locationRepository.regionExists(regionId);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${regionId}' አልተገኘም`);
    }

    const woredas = await this.locationRepository.getWoredasByRegion(regionId);
    
    // ስሞችን ለማግኘት
    const regionNames = new Map<string, string>();
    const zoneNames = new Map<string, string>();
    const cityNames = new Map<string, string>();
    const subcityNames = new Map<string, string>();
    
    const region = await this.locationRepository.getRegionById(regionId);
    if (region) {
      regionNames.set(regionId, region.name);
    }
    
    for (const woreda of woredas) {
      if (woreda.zoneId && !zoneNames.has(woreda.zoneId)) {
        const zone = await this.locationRepository.getZoneById(woreda.zoneId);
        if (zone) {
          zoneNames.set(woreda.zoneId, zone.name);
        }
      }
      if (woreda.cityId && !cityNames.has(woreda.cityId)) {
        const city = await this.locationRepository.getCityById(woreda.cityId);
        if (city) {
          cityNames.set(woreda.cityId, city.name);
        }
      }
      if (woreda.subcityId && !subcityNames.has(woreda.subcityId)) {
        const subcity = await this.locationRepository.getSubcityById(woreda.subcityId);
        if (subcity) {
          subcityNames.set(woreda.subcityId, subcity.name);
        }
      }
    }
    
    return this.locationMapper.toWoredaResponseDtoList(
      woredas,
      regionNames,
      zoneNames,
      cityNames,
      subcityNames
    );
  }

  // ሁሉንም ወረዳዎች ማግኘት
  async getAllWoredas(): Promise<WoredaResponseDto[]> {
    const woredas = await this.locationRepository.getAllWoredas();
    
    // ስሞችን ለማግኘት
    const regionNames = new Map<string, string>();
    const zoneNames = new Map<string, string>();
    const cityNames = new Map<string, string>();
    const subcityNames = new Map<string, string>();
    
    for (const woreda of woredas) {
      if (woreda.regionId && !regionNames.has(woreda.regionId)) {
        const region = await this.locationRepository.getRegionById(woreda.regionId);
        if (region) {
          regionNames.set(woreda.regionId, region.name);
        }
      }
      if (woreda.zoneId && !zoneNames.has(woreda.zoneId)) {
        const zone = await this.locationRepository.getZoneById(woreda.zoneId);
        if (zone) {
          zoneNames.set(woreda.zoneId, zone.name);
        }
      }
      if (woreda.cityId && !cityNames.has(woreda.cityId)) {
        const city = await this.locationRepository.getCityById(woreda.cityId);
        if (city) {
          cityNames.set(woreda.cityId, city.name);
        }
      }
      if (woreda.subcityId && !subcityNames.has(woreda.subcityId)) {
        const subcity = await this.locationRepository.getSubcityById(woreda.subcityId);
        if (subcity) {
          subcityNames.set(woreda.subcityId, subcity.name);
        }
      }
    }
    
    return this.locationMapper.toWoredaResponseDtoList(
      woredas,
      regionNames,
      zoneNames,
      cityNames,
      subcityNames
    );
  }

  // ወረዳ ማዘመን
  async updateWoreda(id: string, updateWoredaDto: UpdateWoredaDto): Promise<WoredaResponseDto> {
    // ወረዳው መኖሩን አረጋግጥ
    const woredaExists = await this.locationRepository.woredaExists(id);
    if (!woredaExists) {
      throw new NotFoundException(`ወረዳ በID '${id}' አልተገኘም`);
    }

    // ግንኙነቶች መኖራቸውን አረጋግጥ (ከተቀየሩ)
    if (updateWoredaDto.regionId) {
      const regionExists = await this.locationRepository.regionExists(updateWoredaDto.regionId);
      if (!regionExists) {
        throw new NotFoundException(`ክልል በID '${updateWoredaDto.regionId}' አልተገኘም`);
      }
    }

    if (updateWoredaDto.zoneId) {
      const zoneExists = await this.locationRepository.zoneExists(updateWoredaDto.zoneId);
      if (!zoneExists) {
        throw new NotFoundException(`ዞን በID '${updateWoredaDto.zoneId}' አልተገኘም`);
      }
    }

    if (updateWoredaDto.cityId) {
      const cityExists = await this.locationRepository.cityExists(updateWoredaDto.cityId);
      if (!cityExists) {
        throw new NotFoundException(`ከተማ በID '${updateWoredaDto.cityId}' አልተገኘም`);
      }
    }

    if (updateWoredaDto.subcityId) {
      const subcityExists = await this.locationRepository.subcityExists(updateWoredaDto.subcityId);
      if (!subcityExists) {
        throw new NotFoundException(`ክፍለ ከተማ በID '${updateWoredaDto.subcityId}' አልተገኘም`);
      }
    }

    const woredaEntity = this.locationMapper.toWoredaEntityFromUpdate(updateWoredaDto);
    const updatedWoreda = await this.locationRepository.updateWoreda(id, woredaEntity);
    
    const region = updatedWoreda.regionId ? await this.locationRepository.getRegionById(updatedWoreda.regionId) : null;
    const zone = updatedWoreda.zoneId ? await this.locationRepository.getZoneById(updatedWoreda.zoneId) : null;
    const city = updatedWoreda.cityId ? await this.locationRepository.getCityById(updatedWoreda.cityId) : null;
    const subcity = updatedWoreda.subcityId ? await this.locationRepository.getSubcityById(updatedWoreda.subcityId) : null;
    
    return this.locationMapper.toWoredaResponseDto(
      updatedWoreda,
      region?.name,
      zone?.name,
      city?.name,
      subcity?.name
    );
  }

  // ወረዳ ለስላሳ ሰርዝ
  async softDeleteWoreda(id: string): Promise<WoredaResponseDto> {
    const woredaExists = await this.locationRepository.woredaExists(id);
    if (!woredaExists) {
      throw new NotFoundException(`ወረዳ በID '${id}' አልተገኘም`);
    }

    const deletedWoreda = await this.locationRepository.softDeleteWoreda(id);
    
    const region = deletedWoreda.regionId ? await this.locationRepository.getRegionById(deletedWoreda.regionId) : null;
    const zone = deletedWoreda.zoneId ? await this.locationRepository.getZoneById(deletedWoreda.zoneId) : null;
    const city = deletedWoreda.cityId ? await this.locationRepository.getCityById(deletedWoreda.cityId) : null;
    const subcity = deletedWoreda.subcityId ? await this.locationRepository.getSubcityById(deletedWoreda.subcityId) : null;
    
    return this.locationMapper.toWoredaResponseDto(
      deletedWoreda,
      region?.name,
      zone?.name,
      city?.name,
      subcity?.name
    );
  }

  // ወረዳ ሙሉ በሙሉ መሰረዝ
  async hardDeleteWoreda(id: string): Promise<void> {
    const woredaExists = await this.locationRepository.woredaExists(id);
    if (!woredaExists) {
      throw new NotFoundException(`ወረዳ በID '${id}' አልተገኘም`);
    }

    await this.locationRepository.hardDeleteWoreda(id);
  }

  // ==================== Kebele Methods ====================

  // አዲስ ቀበሌ መፍጠር
  async createKebele(createKebeleDto: CreateKebeleDto): Promise<KebeleResponseDto> {
    // ክልሉ መኖሩን አረጋግጥ
    const regionExists = await this.locationRepository.regionExists(createKebeleDto.regionId);
    if (!regionExists) {
      throw new NotFoundException(`ክልል በID '${createKebeleDto.regionId}' አልተገኘም`);
    }

    // ሌሎች ግንኙነቶችን አረጋግጥ
    if (createKebeleDto.zoneId) {
      const zoneExists = await this.locationRepository.zoneExists(createKebeleDto.zoneId);
      if (!zoneExists) {
        throw new NotFoundException(`ዞን በID '${createKebeleDto.zoneId}' አልተገኘም`);
      }
    }

    if (createKebeleDto.cityId) {
      const cityExists = await this.locationRepository.cityExists(createKebeleDto.cityId);
      if (!cityExists) {
        throw new NotFoundException(`ከተማ በID '${createKebeleDto.cityId}' አልተገኘም`);
      }
    }

    if (createKebeleDto.subcityId) {
      const subcityExists = await this.locationRepository.subcityExists(createKebeleDto.subcityId);
      if (!subcityExists) {
        throw new NotFoundException(`ክፍለ ከተማ በID '${createKebeleDto.subcityId}' አልተገኘም`);
      }
    }

    if (createKebeleDto.woredaId) {
      const woredaExists = await this.locationRepository.woredaExists(createKebeleDto.woredaId);
      if (!woredaExists) {
        throw new NotFoundException(`ወረዳ በID '${createKebeleDto.woredaId}' አልተገኘም`);
      }
    }

    // ቀበሌው በስም እና በወረዳ አስቀድሞ መኖሩን አረጋግጥ
    if (createKebeleDto.woredaId) {
      const existingKebele = await this.locationRepository.getKebeleByNameAndWoreda(
        createKebeleDto.name,
        createKebeleDto.woredaId
      );
      if (existingKebele) {
        throw new ConflictException(`ቀበሌ '${createKebeleDto.name}' በዚህ ወረዳ አስቀድሞ ተመዝግቧል`);
      }
    }

    const kebeleEntity = this.locationMapper.toKebeleEntityFromCreate(createKebeleDto);
    const newKebele = await this.locationRepository.createKebele(kebeleEntity);
    
    // ሁሉንም ስሞች ለማግኘት
    const hierarchy = await this.locationRepository.getFullLocationHierarchy(newKebele.id);
    
    return this.locationMapper.toKebeleResponseDto(
      newKebele,
      hierarchy.region?.name,
      hierarchy.zone?.name,
      hierarchy.city?.name,
      hierarchy.subcity?.name,
      hierarchy.woreda?.name
    );
  }

  // ቀበሌ በID ማግኘት
  async getKebeleById(id: string): Promise<KebeleResponseDto> {
    const kebele = await this.locationRepository.getKebeleById(id);
    if (!kebele) {
      throw new NotFoundException(`ቀበሌ በID '${id}' አልተገኘም`);
    }
    
    const hierarchy = await this.locationRepository.getFullLocationHierarchy(id);
    
    return this.locationMapper.toKebeleResponseDto(
      kebele,
      hierarchy.region?.name,
      hierarchy.zone?.name,
      hierarchy.city?.name,
      hierarchy.subcity?.name,
      hierarchy.woreda?.name
    );
  }
async getKebelesByRegion(regionId: string): Promise<KebeleResponseDto[]> {
  const regionExists = await this.locationRepository.regionExists(regionId);
  if (!regionExists) {
    throw new NotFoundException(`ክልል በID '${regionId}' አልተገኘም`);
  }

  const kebeles = await this.locationRepository.getKebelesByRegion(regionId);
  
  // ሁሉንም ስሞች ለማግኘት
  const regionNames = new Map<string, string>();
  const zoneNames = new Map<string, string>();
  const cityNames = new Map<string, string>();
  const subcityNames = new Map<string, string>();
  const woredaNames = new Map<string, string>();
  
  const region = await this.locationRepository.getRegionById(regionId);
  if (region) {
    regionNames.set(regionId, region.name);
  }
  
  for (const kebele of kebeles) {
    if (kebele.zoneId && !zoneNames.has(kebele.zoneId)) {
      const zone = await this.locationRepository.getZoneById(kebele.zoneId);
      if (zone) {
        zoneNames.set(kebele.zoneId, zone.name);
      }
    }
    if (kebele.cityId && !cityNames.has(kebele.cityId)) {
      const city = await this.locationRepository.getCityById(kebele.cityId);
      if (city) {
        cityNames.set(kebele.cityId, city.name);
      }
    }
    if (kebele.subcityId && !subcityNames.has(kebele.subcityId)) {
      const subcity = await this.locationRepository.getSubcityById(kebele.subcityId);
      if (subcity) {
        subcityNames.set(kebele.subcityId, subcity.name);
      }
    }
    if (kebele.woredaId && !woredaNames.has(kebele.woredaId)) {
      const woreda = await this.locationRepository.getWoredaById(kebele.woredaId);
      if (woreda) {
        woredaNames.set(kebele.woredaId, woreda.name);
      }
    }
  }
  
  return this.locationMapper.toKebeleResponseDtoList(
    kebeles,
    regionNames,
    zoneNames,
    cityNames,
    subcityNames,
    woredaNames
  );
}

// በዞን የሚገኙ ቀበሌዎችን ማግኘት
async getKebelesByZone(zoneId: string): Promise<KebeleResponseDto[]> {
  const zoneExists = await this.locationRepository.zoneExists(zoneId);
  if (!zoneExists) {
    throw new NotFoundException(`ዞን በID '${zoneId}' አልተገኘም`);
  }

  const kebeles = await this.locationRepository.getKebelesByZone(zoneId);
  
  // ሁሉንም ስሞች ለማግኘት
  const regionNames = new Map<string, string>();
  const zoneNames = new Map<string, string>();
  const cityNames = new Map<string, string>();
  const subcityNames = new Map<string, string>();
  const woredaNames = new Map<string, string>();
  
  const zone = await this.locationRepository.getZoneById(zoneId);
  if (zone) {
    zoneNames.set(zoneId, zone.name);
    if (zone.regionId) {
      const region = await this.locationRepository.getRegionById(zone.regionId);
      if (region) {
        regionNames.set(zone.regionId, region.name);
      }
    }
  }
  
  for (const kebele of kebeles) {
    if (kebele.cityId && !cityNames.has(kebele.cityId)) {
      const city = await this.locationRepository.getCityById(kebele.cityId);
      if (city) {
        cityNames.set(kebele.cityId, city.name);
      }
    }
    if (kebele.subcityId && !subcityNames.has(kebele.subcityId)) {
      const subcity = await this.locationRepository.getSubcityById(kebele.subcityId);
      if (subcity) {
        subcityNames.set(kebele.subcityId, subcity.name);
      }
    }
    if (kebele.woredaId && !woredaNames.has(kebele.woredaId)) {
      const woreda = await this.locationRepository.getWoredaById(kebele.woredaId);
      if (woreda) {
        woredaNames.set(kebele.woredaId, woreda.name);
      }
    }
  }
  
  return this.locationMapper.toKebeleResponseDtoList(
    kebeles,
    regionNames,
    zoneNames,
    cityNames,
    subcityNames,
    woredaNames
  );
}

// በከተማ የሚገኙ ቀበሌዎችን ማግኘት
async getKebelesByCity(cityId: string): Promise<KebeleResponseDto[]> {
  const cityExists = await this.locationRepository.cityExists(cityId);
  if (!cityExists) {
    throw new NotFoundException(`ከተማ በID '${cityId}' አልተገኘም`);
  }

  const kebeles = await this.locationRepository.getKebelesByCity(cityId);
  
  // ሁሉንም ስሞች ለማግኘት
  const regionNames = new Map<string, string>();
  const zoneNames = new Map<string, string>();
  const cityNames = new Map<string, string>();
  const subcityNames = new Map<string, string>();
  const woredaNames = new Map<string, string>();
  
  const city = await this.locationRepository.getCityById(cityId);
  if (city) {
    cityNames.set(cityId, city.name);
    if (city.regionId) {
      const region = await this.locationRepository.getRegionById(city.regionId);
      if (region) {
        regionNames.set(city.regionId, region.name);
      }
    }
    if (city.zoneId) {
      const zone = await this.locationRepository.getZoneById(city.zoneId);
      if (zone) {
        zoneNames.set(city.zoneId, zone.name);
      }
    }
  }
  
  for (const kebele of kebeles) {
    if (kebele.subcityId && !subcityNames.has(kebele.subcityId)) {
      const subcity = await this.locationRepository.getSubcityById(kebele.subcityId);
      if (subcity) {
        subcityNames.set(kebele.subcityId, subcity.name);
      }
    }
    if (kebele.woredaId && !woredaNames.has(kebele.woredaId)) {
      const woreda = await this.locationRepository.getWoredaById(kebele.woredaId);
      if (woreda) {
        woredaNames.set(kebele.woredaId, woreda.name);
      }
    }
  }
  
  return this.locationMapper.toKebeleResponseDtoList(
    kebeles,
    regionNames,
    zoneNames,
    cityNames,
    subcityNames,
    woredaNames
  );
}
async getWoredasByZone(zoneId: string): Promise<WoredaResponseDto[]> {
  const zoneExists = await this.locationRepository.zoneExists(zoneId);
  if (!zoneExists) {
    throw new NotFoundException(`ዞን በID '${zoneId}' አልተገኘም`);
  }

  const woredas = await this.locationRepository.getWoredasByZone(zoneId);
  
  // ስሞችን ለማግኘት
  const regionNames = new Map<string, string>();
  const zoneNames = new Map<string, string>();
  const cityNames = new Map<string, string>();
  const subcityNames = new Map<string, string>();
  
  const zone = await this.locationRepository.getZoneById(zoneId);
  if (zone) {
    zoneNames.set(zoneId, zone.name);
    if (zone.regionId) {
      const region = await this.locationRepository.getRegionById(zone.regionId);
      if (region) {
        regionNames.set(zone.regionId, region.name);
      }
    }
  }
  
  for (const woreda of woredas) {
    if (woreda.cityId && !cityNames.has(woreda.cityId)) {
      const city = await this.locationRepository.getCityById(woreda.cityId);
      if (city) {
        cityNames.set(woreda.cityId, city.name);
      }
    }
    if (woreda.subcityId && !subcityNames.has(woreda.subcityId)) {
      const subcity = await this.locationRepository.getSubcityById(woreda.subcityId);
      if (subcity) {
        subcityNames.set(woreda.subcityId, subcity.name);
      }
    }
  }
  
  return this.locationMapper.toWoredaResponseDtoList(
    woredas,
    regionNames,
    zoneNames,
    cityNames,
    subcityNames
  );
}

// በከተማ የሚገኙ ወረዳዎችን ማግኘት
async getWoredasByCity(cityId: string): Promise<WoredaResponseDto[]> {
  const cityExists = await this.locationRepository.cityExists(cityId);
  if (!cityExists) {
    throw new NotFoundException(`ከተማ በID '${cityId}' አልተገኘም`);
  }

  const woredas = await this.locationRepository.getWoredasByCity(cityId);
  
  // ስሞችን ለማግኘት
  const regionNames = new Map<string, string>();
  const zoneNames = new Map<string, string>();
  const cityNames = new Map<string, string>();
  const subcityNames = new Map<string, string>();
  
  const city = await this.locationRepository.getCityById(cityId);
  if (city) {
    cityNames.set(cityId, city.name);
    if (city.regionId) {
      const region = await this.locationRepository.getRegionById(city.regionId);
      if (region) {
        regionNames.set(city.regionId, region.name);
      }
    }
    if (city.zoneId) {
      const zone = await this.locationRepository.getZoneById(city.zoneId);
      if (zone) {
        zoneNames.set(city.zoneId, zone.name);
      }
    }
  }
  
  for (const woreda of woredas) {
    if (woreda.subcityId && !subcityNames.has(woreda.subcityId)) {
      const subcity = await this.locationRepository.getSubcityById(woreda.subcityId);
      if (subcity) {
        subcityNames.set(woreda.subcityId, subcity.name);
      }
    }
  }
  
  return this.locationMapper.toWoredaResponseDtoList(
    woredas,
    regionNames,
    zoneNames,
    cityNames,
    subcityNames
  );
}

// በክፍለ ከተማ የሚገኙ ወረዳዎችን ማግኘት
async getWoredasBySubcity(subcityId: string): Promise<WoredaResponseDto[]> {
  const subcityExists = await this.locationRepository.subcityExists(subcityId);
  if (!subcityExists) {
    throw new NotFoundException(`ክፍለ ከተማ በID '${subcityId}' አልተገኘም`);
  }

  const woredas = await this.locationRepository.getWoredasBySubcity(subcityId);
  
  // ስሞችን ለማግኘት
  const regionNames = new Map<string, string>();
  const zoneNames = new Map<string, string>();
  const cityNames = new Map<string, string>();
  const subcityNames = new Map<string, string>();
  
  const subcity = await this.locationRepository.getSubcityById(subcityId);
  if (subcity) {
    subcityNames.set(subcityId, subcity.name);
    if (subcity.cityId) {
      const city = await this.locationRepository.getCityById(subcity.cityId);
      if (city) {
        cityNames.set(subcity.cityId, city.name);
        if (city.regionId) {
          const region = await this.locationRepository.getRegionById(city.regionId);
          if (region) {
            regionNames.set(city.regionId, region.name);
          }
        }
        if (city.zoneId) {
          const zone = await this.locationRepository.getZoneById(city.zoneId);
          if (zone) {
            zoneNames.set(city.zoneId, zone.name);
          }
        }
      }
    }
  }
  
  return this.locationMapper.toWoredaResponseDtoList(
    woredas,
    regionNames,
    zoneNames,
    cityNames,
    subcityNames
  );
}

// በክፍለ ከተማ የሚገኙ ቀበሌዎችን ማግኘት
async getKebelesBySubcity(subcityId: string): Promise<KebeleResponseDto[]> {
  const subcityExists = await this.locationRepository.subcityExists(subcityId);
  if (!subcityExists) {
    throw new NotFoundException(`ክፍለ ከተማ በID '${subcityId}' አልተገኘም`);
  }

  const kebeles = await this.locationRepository.getKebelesBySubcity(subcityId);
  
  // ሁሉንም ስሞች ለማግኘት
  const regionNames = new Map<string, string>();
  const zoneNames = new Map<string, string>();
  const cityNames = new Map<string, string>();
  const subcityNames = new Map<string, string>();
  const woredaNames = new Map<string, string>();
  
  const subcity = await this.locationRepository.getSubcityById(subcityId);
  if (subcity) {
    subcityNames.set(subcityId, subcity.name);
    if (subcity.cityId) {
      const city = await this.locationRepository.getCityById(subcity.cityId);
      if (city) {
        cityNames.set(subcity.cityId, city.name);
        if (city.regionId) {
          const region = await this.locationRepository.getRegionById(city.regionId);
          if (region) {
            regionNames.set(city.regionId, region.name);
          }
        }
        if (city.zoneId) {
          const zone = await this.locationRepository.getZoneById(city.zoneId);
          if (zone) {
            zoneNames.set(city.zoneId, zone.name);
          }
        }
      }
    }
  }
  
  for (const kebele of kebeles) {
    if (kebele.woredaId && !woredaNames.has(kebele.woredaId)) {
      const woreda = await this.locationRepository.getWoredaById(kebele.woredaId);
      if (woreda) {
        woredaNames.set(kebele.woredaId, woreda.name);
      }
    }
  }
  
  return this.locationMapper.toKebeleResponseDtoList(
    kebeles,
    regionNames,
    zoneNames,
    cityNames,
    subcityNames,
    woredaNames
  );
}
  // በወረዳ የሚገኙ ቀበሌዎችን ማግኘት
  async getKebelesByWoreda(woredaId: string): Promise<KebeleResponseDto[]> {
    const woredaExists = await this.locationRepository.woredaExists(woredaId);
    if (!woredaExists) {
      throw new NotFoundException(`ወረዳ በID '${woredaId}' አልተገኘም`);
    }

    const kebeles = await this.locationRepository.getKebelesByWoreda(woredaId);
    
    // ሁሉንም ስሞች ለማግኘት
    const regionNames = new Map<string, string>();
    const zoneNames = new Map<string, string>();
    const cityNames = new Map<string, string>();
    const subcityNames = new Map<string, string>();
    const woredaNames = new Map<string, string>();
    
    const woreda = await this.locationRepository.getWoredaById(woredaId);
    if (woreda) {
      woredaNames.set(woredaId, woreda.name);
      if (woreda.regionId) {
        const region = await this.locationRepository.getRegionById(woreda.regionId);
        if (region) {
          regionNames.set(woreda.regionId, region.name);
        }
      }
      if (woreda.zoneId) {
        const zone = await this.locationRepository.getZoneById(woreda.zoneId);
        if (zone) {
          zoneNames.set(woreda.zoneId, zone.name);
        }
      }
      if (woreda.cityId) {
        const city = await this.locationRepository.getCityById(woreda.cityId);
        if (city) {
          cityNames.set(woreda.cityId, city.name);
        }
      }
      if (woreda.subcityId) {
        const subcity = await this.locationRepository.getSubcityById(woreda.subcityId);
        if (subcity) {
          subcityNames.set(woreda.subcityId, subcity.name);
        }
      }
    }
    
    return this.locationMapper.toKebeleResponseDtoList(
      kebeles,
      regionNames,
      zoneNames,
      cityNames,
      subcityNames,
      woredaNames
    );
  }

  // ሁሉንም ቀበሌዎች ማግኘት
  async getAllKebeles(): Promise<KebeleResponseDto[]> {
    const kebeles = await this.locationRepository.getAllKebeles();
    
    // ሁሉንም ስሞች ለማግኘት
    const regionNames = new Map<string, string>();
    const zoneNames = new Map<string, string>();
    const cityNames = new Map<string, string>();
    const subcityNames = new Map<string, string>();
    const woredaNames = new Map<string, string>();
    
    for (const kebele of kebeles) {
      if (kebele.regionId && !regionNames.has(kebele.regionId)) {
        const region = await this.locationRepository.getRegionById(kebele.regionId);
        if (region) {
          regionNames.set(kebele.regionId, region.name);
        }
      }
      if (kebele.zoneId && !zoneNames.has(kebele.zoneId)) {
        const zone = await this.locationRepository.getZoneById(kebele.zoneId);
        if (zone) {
          zoneNames.set(kebele.zoneId, zone.name);
        }
      }
      if (kebele.cityId && !cityNames.has(kebele.cityId)) {
        const city = await this.locationRepository.getCityById(kebele.cityId);
        if (city) {
          cityNames.set(kebele.cityId, city.name);
        }
      }
      if (kebele.subcityId && !subcityNames.has(kebele.subcityId)) {
        const subcity = await this.locationRepository.getSubcityById(kebele.subcityId);
        if (subcity) {
          subcityNames.set(kebele.subcityId, subcity.name);
        }
      }
      if (kebele.woredaId && !woredaNames.has(kebele.woredaId)) {
        const woreda = await this.locationRepository.getWoredaById(kebele.woredaId);
        if (woreda) {
          woredaNames.set(kebele.woredaId, woreda.name);
        }
      }
    }
    
    return this.locationMapper.toKebeleResponseDtoList(
      kebeles,
      regionNames,
      zoneNames,
      cityNames,
      subcityNames,
      woredaNames
    );
  }

  // ዲጂታል ማህተም ያላቸውን ቀበሌዎች ማግኘት
  async getKebelesWithDigitalSeal(): Promise<KebeleResponseDto[]> {
    const kebeles = await this.locationRepository.getKebelesWithDigitalSeal();
    
    // ሁሉንም ስሞች ለማግኘት
    const regionNames = new Map<string, string>();
    const zoneNames = new Map<string, string>();
    const cityNames = new Map<string, string>();
    const subcityNames = new Map<string, string>();
    const woredaNames = new Map<string, string>();
    
    for (const kebele of kebeles) {
      if (kebele.regionId && !regionNames.has(kebele.regionId)) {
        const region = await this.locationRepository.getRegionById(kebele.regionId);
        if (region) {
          regionNames.set(kebele.regionId, region.name);
        }
      }
      if (kebele.zoneId && !zoneNames.has(kebele.zoneId)) {
        const zone = await this.locationRepository.getZoneById(kebele.zoneId);
        if (zone) {
          zoneNames.set(kebele.zoneId, zone.name);
        }
      }
      if (kebele.cityId && !cityNames.has(kebele.cityId)) {
        const city = await this.locationRepository.getCityById(kebele.cityId);
        if (city) {
          cityNames.set(kebele.cityId, city.name);
        }
      }
      if (kebele.subcityId && !subcityNames.has(kebele.subcityId)) {
        const subcity = await this.locationRepository.getSubcityById(kebele.subcityId);
        if (subcity) {
          subcityNames.set(kebele.subcityId, subcity.name);
        }
      }
      if (kebele.woredaId && !woredaNames.has(kebele.woredaId)) {
        const woreda = await this.locationRepository.getWoredaById(kebele.woredaId);
        if (woreda) {
          woredaNames.set(kebele.woredaId, woreda.name);
        }
      }
    }
    
    return this.locationMapper.toKebeleResponseDtoList(
      kebeles,
      regionNames,
      zoneNames,
      cityNames,
      subcityNames,
      woredaNames
    );
  }

  // ቀበሌ ማዘመን
  async updateKebele(id: string, updateKebeleDto: UpdateKebeleDto): Promise<KebeleResponseDto> {
    // ቀበሌው መኖሩን አረጋግጥ
    const kebeleExists = await this.locationRepository.kebeleExists(id);
    if (!kebeleExists) {
      throw new NotFoundException(`ቀበሌ በID '${id}' አልተገኘም`);
    }

    // ግንኙነቶችን አረጋግጥ (ከተቀየሩ)
    if (updateKebeleDto.regionId) {
      const regionExists = await this.locationRepository.regionExists(updateKebeleDto.regionId);
      if (!regionExists) {
        throw new NotFoundException(`ክልል በID '${updateKebeleDto.regionId}' አልተገኘም`);
      }
    }

    if (updateKebeleDto.zoneId) {
      const zoneExists = await this.locationRepository.zoneExists(updateKebeleDto.zoneId);
      if (!zoneExists) {
        throw new NotFoundException(`ዞን በID '${updateKebeleDto.zoneId}' አልተገኘም`);
      }
    }

    if (updateKebeleDto.cityId) {
      const cityExists = await this.locationRepository.cityExists(updateKebeleDto.cityId);
      if (!cityExists) {
        throw new NotFoundException(`ከተማ በID '${updateKebeleDto.cityId}' አልተገኘም`);
      }
    }

    if (updateKebeleDto.subcityId) {
      const subcityExists = await this.locationRepository.subcityExists(updateKebeleDto.subcityId);
      if (!subcityExists) {
        throw new NotFoundException(`ክፍለ ከተማ በID '${updateKebeleDto.subcityId}' አልተገኘም`);
      }
    }

    if (updateKebeleDto.woredaId) {
      const woredaExists = await this.locationRepository.woredaExists(updateKebeleDto.woredaId);
      if (!woredaExists) {
        throw new NotFoundException(`ወረዳ በID '${updateKebeleDto.woredaId}' አልተገኘም`);
      }
    }

    const kebeleEntity = this.locationMapper.toKebeleEntityFromUpdate(updateKebeleDto);
    const updatedKebele = await this.locationRepository.updateKebele(id, kebeleEntity);
    
    const hierarchy = await this.locationRepository.getFullLocationHierarchy(id);
    
    return this.locationMapper.toKebeleResponseDto(
      updatedKebele,
      hierarchy.region?.name,
      hierarchy.zone?.name,
      hierarchy.city?.name,
      hierarchy.subcity?.name,
      hierarchy.woreda?.name
    );
  }

  // ቀበሌ ለስላሳ ሰርዝ
  async softDeleteKebele(id: string): Promise<KebeleResponseDto> {
    const kebeleExists = await this.locationRepository.kebeleExists(id);
    if (!kebeleExists) {
      throw new NotFoundException(`ቀበሌ በID '${id}' አልተገኘም`);
    }

    const deletedKebele = await this.locationRepository.softDeleteKebele(id);
    
    const hierarchy = await this.locationRepository.getFullLocationHierarchy(id);
    
    return this.locationMapper.toKebeleResponseDto(
      deletedKebele,
      hierarchy.region?.name,
      hierarchy.zone?.name,
      hierarchy.city?.name,
      hierarchy.subcity?.name,
      hierarchy.woreda?.name
    );
  }

  // ቀበሌ ሙሉ በሙሉ መሰረዝ
  async hardDeleteKebele(id: string): Promise<void> {
    const kebeleExists = await this.locationRepository.kebeleExists(id);
    if (!kebeleExists) {
      throw new NotFoundException(`ቀበሌ በID '${id}' አልተገኘም`);
    }

    await this.locationRepository.hardDeleteKebele(id);
  }

  // ==================== Helper Methods ====================

  // ሙሉ የአካባቢ ተዋረድ ማግኘት
  async getFullLocationHierarchy(kebeleId: string): Promise<{
    region: RegionResponseDto | null;
    zone: ZoneResponseDto | null;
    city: CityResponseDto | null;
    subcity: SubcityResponseDto | null;
    woreda: WoredaResponseDto | null;
    kebele: KebeleResponseDto | null;
  }> {
    const kebele = await this.locationRepository.getKebeleById(kebeleId);
    if (!kebele) {
      return {
        region: null,
        zone: null,
        city: null,
        subcity: null,
        woreda: null,
        kebele: null,
      };
    }

    const hierarchy = await this.locationRepository.getFullLocationHierarchy(kebeleId);
    
    return {
      region: hierarchy.region ? this.locationMapper.toRegionResponseDto(hierarchy.region) : null,
      zone: hierarchy.zone ? await this.getZoneById(hierarchy.zone.id) : null,
      city: hierarchy.city ? await this.getCityById(hierarchy.city.id) : null,
      subcity: hierarchy.subcity ? await this.getSubcityById(hierarchy.subcity.id) : null,
      woreda: hierarchy.woreda ? await this.getWoredaById(hierarchy.woreda.id) : null,
      kebele: hierarchy.kebele ? await this.getKebeleById(hierarchy.kebele.id) : null,
    };
  }

  // በክልል ስር ያሉትን ሁሉንም አካባቢዎች ማግኘት
  async getRegionHierarchy(regionId: string): Promise<{
    region: RegionResponseDto | null;
    zones: ZoneResponseDto[];
    cities: CityResponseDto[];
    subcities: SubcityResponseDto[];
    woredas: WoredaResponseDto[];
    kebeles: KebeleResponseDto[];
  }> {
    const region = await this.locationRepository.getRegionById(regionId);
    if (!region) {
      throw new NotFoundException(`ክልል በID '${regionId}' አልተገኘም`);
    }

    const hierarchy = await this.locationRepository.getRegionHierarchy(regionId);
    
    // ስሞችን ለማግኘት
    const zoneNames = new Map<string, string>();
    const cityNames = new Map<string, string>();
    const subcityNames = new Map<string, string>();
    const woredaNames = new Map<string, string>();
    
    for (const zone of hierarchy.zones) {
      zoneNames.set(zone.id, zone.name);
    }
    
    for (const city of hierarchy.cities) {
      cityNames.set(city.id, city.name);
      if (city.zoneId && zoneNames.has(city.zoneId)) {
        // ቀድሞውኑ አለ
      }
    }
    
    for (const subcity of hierarchy.subcities) {
      subcityNames.set(subcity.id, subcity.name);
    }
    
    for (const woreda of hierarchy.woredas) {
      woredaNames.set(woreda.id, woreda.name);
    }
    
    return {
      region: this.locationMapper.toRegionResponseDto(region),
      zones: this.locationMapper.toZoneResponseDtoList(hierarchy.zones, new Map([[regionId, region.name]])),
      cities: this.locationMapper.toCityResponseDtoList(hierarchy.cities, new Map([[regionId, region.name]]), zoneNames),
      subcities: this.locationMapper.toSubcityResponseDtoList(hierarchy.subcities, cityNames),
      woredas: this.locationMapper.toWoredaResponseDtoList(
        hierarchy.woredas,
        new Map([[regionId, region.name]]),
        zoneNames,
        cityNames,
        subcityNames
      ),
      kebeles: this.locationMapper.toKebeleResponseDtoList(
        hierarchy.kebeles,
        new Map([[regionId, region.name]]),
        zoneNames,
        cityNames,
        subcityNames,
        woredaNames
      ),
    };
  }
}