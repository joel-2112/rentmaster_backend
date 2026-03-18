import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ILocationRepository } from '../../../domain/ports/repositories/location.repository.interface';
import { RegionEntity } from '../../../domain/entities/region.entity';
import { ZoneEntity } from '../../../domain/entities/zone.entity';
import { CityEntity } from '../../../domain/entities/city.entity';
import { SubcityEntity } from '../../../domain/entities/subcity.entity';
import { WoredaEntity } from '../../../domain/entities/woreda.entity';
import { KebeleEntity } from '../../../domain/entities/kebele.entity';

@Injectable()
export class PrismaLocationRepository implements ILocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== Region Implementations ====================

  async createRegion(region: Partial<RegionEntity>): Promise<RegionEntity> {
    const newRegion = await this.prisma.region.create({
      data: {
        name: region.name!,
        code: region.code!,
      },
    });
    return new RegionEntity(newRegion);
  }

  async getRegionById(id: string): Promise<RegionEntity | null> {
    const region = await this.prisma.region.findUnique({
      where: { id },
    });
    return region ? new RegionEntity(region) : null;
  }

  async getRegionByName(name: string): Promise<RegionEntity | null> {
    const region = await this.prisma.region.findUnique({
      where: { name },
    });
    return region ? new RegionEntity(region) : null;
  }

  async getRegionByCode(code: string): Promise<RegionEntity | null> {
    const region = await this.prisma.region.findUnique({
      where: { code },
    });
    return region ? new RegionEntity(region) : null;
  }

  async getAllRegions(): Promise<RegionEntity[]> {
    const regions = await this.prisma.region.findMany();
    return regions.map((region) => new RegionEntity(region));
  }

  async getActiveRegions(): Promise<RegionEntity[]> {
    // Region ሞዴል ላይ isActive ባለመኖሩ ሁሉንም እንመልሳለን
    // በኋላ ላይ isActive ቢጨመር እንለውጠዋለን
    return this.getAllRegions();
  }

  async updateRegion(
    id: string,
    region: Partial<RegionEntity>,
  ): Promise<RegionEntity> {
    const updatedRegion = await this.prisma.region.update({
      where: { id },
      data: {
        name: region.name,
        code: region.code,
      },
    });
    return new RegionEntity(updatedRegion);
  }

  async softDeleteRegion(id: string): Promise<RegionEntity> {
    // Region ሞዴል ላይ isActive ስለሌለ እስካሁን አንሰርዝም
    // በኋላ ላይ እንተገብራለን
    throw new Error('Soft delete not implemented for Region yet');
  }

  async hardDeleteRegion(id: string): Promise<void> {
    await this.prisma.region.delete({
      where: { id },
    });
  }

  async regionExists(id: string): Promise<boolean> {
    const count = await this.prisma.region.count({
      where: { id },
    });
    return count > 0;
  }

  async regionExistsByName(name: string): Promise<boolean> {
    const count = await this.prisma.region.count({
      where: { name },
    });
    return count > 0;
  }

  // ==================== Zone Implementations ====================

  async createZone(zone: Partial<ZoneEntity>): Promise<ZoneEntity> {
    const newZone = await this.prisma.zone.create({
      data: {
        name: zone.name!,
        code: zone.code,
        regionId: zone.regionId!,
      },
    });
    return new ZoneEntity(newZone);
  }

  async getZoneById(id: string): Promise<ZoneEntity | null> {
    const zone = await this.prisma.zone.findUnique({
      where: { id },
      include: { region: true },
    });
    return zone
      ? new ZoneEntity({
          ...zone,
          region: zone.region ? new RegionEntity(zone.region) : undefined,
        })
      : null;
  }

  async getZoneByNameAndRegion(
    name: string,
    regionId: string,
  ): Promise<ZoneEntity | null> {
    const zone = await this.prisma.zone.findFirst({
      where: {
        name,
        regionId,
      },
    });
    return zone ? new ZoneEntity(zone) : null;
  }

  async getZonesByRegion(regionId: string): Promise<ZoneEntity[]> {
    const zones = await this.prisma.zone.findMany({
      where: { regionId },
      include: { region: true },
    });
    return zones.map(
      (zone) =>
        new ZoneEntity({
          ...zone,
          region: zone.region ? new RegionEntity(zone.region) : undefined,
        }),
    );
  }

  async getAllZones(): Promise<ZoneEntity[]> {
    const zones = await this.prisma.zone.findMany({
      include: { region: true },
    });
    return zones.map(
      (zone) =>
        new ZoneEntity({
          ...zone,
          region: zone.region ? new RegionEntity(zone.region) : undefined,
        }),
    );
  }

  async updateZone(id: string, zone: Partial<ZoneEntity>): Promise<ZoneEntity> {
    const updatedZone = await this.prisma.zone.update({
      where: { id },
      data: {
        name: zone.name,
        code: zone.code,
        regionId: zone.regionId,
      },
      include: { region: true },
    });
    return new ZoneEntity({
      ...updatedZone,
      region: updatedZone.region
        ? new RegionEntity(updatedZone.region)
        : undefined,
    });
  }

  async softDeleteZone(id: string): Promise<ZoneEntity> {
    // Zone ሞዴል ላይ isActive ስለሌለ እስካሁን አንሰርዝም
    throw new Error('Soft delete not implemented for Zone yet');
  }

  async hardDeleteZone(id: string): Promise<void> {
    await this.prisma.zone.delete({
      where: { id },
    });
  }

  async zoneExists(id: string): Promise<boolean> {
    const count = await this.prisma.zone.count({
      where: { id },
    });
    return count > 0;
  }

  async zoneExistsByName(name: string, regionId: string): Promise<boolean> {
    const count = await this.prisma.zone.count({
      where: {
        name,
        regionId,
      },
    });
    return count > 0;
  }

  // ==================== City Implementations ====================

  async createCity(city: Partial<CityEntity>): Promise<CityEntity> {
    const newCity = await this.prisma.city.create({
      data: {
        name: city.name!,
        regionId: city.regionId!,
        zoneId: city.zoneId,
        cityType: city.cityType!,
        municipalityName: city.municipalityName,
        municipalityPhone: city.municipalityPhone,
        municipalityEmail: city.municipalityEmail,
        latitude: city.latitude,
        longitude: city.longitude,
        isActive: city.isActive ?? true,
      },
    });
    return new CityEntity(newCity);
  }

  async getCityById(id: string): Promise<CityEntity | null> {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        region: true,
        zone: true,
      },
    });
    return city
      ? new CityEntity({
          ...city,
          region: city.region ? new RegionEntity(city.region) : undefined,
          zone: city.zone ? new ZoneEntity(city.zone) : undefined,
        })
      : null;
  }

  async getCityByNameAndRegion(
    name: string,
    regionId: string,
  ): Promise<CityEntity | null> {
    const city = await this.prisma.city.findFirst({
      where: {
        name,
        regionId,
      },
    });
    return city ? new CityEntity(city) : null;
  }

  async getCitiesByRegion(regionId: string): Promise<CityEntity[]> {
    const cities = await this.prisma.city.findMany({
      where: { regionId },
      include: {
        region: true,
        zone: true,
      },
    });
    return cities.map(
      (city) =>
        new CityEntity({
          ...city,
          region: city.region ? new RegionEntity(city.region) : undefined,
          zone: city.zone ? new ZoneEntity(city.zone) : undefined,
        }),
    );
  }

  async getCitiesByZone(zoneId: string): Promise<CityEntity[]> {
    const cities = await this.prisma.city.findMany({
      where: { zoneId },
      include: {
        region: true,
        zone: true,
      },
    });
    return cities.map(
      (city) =>
        new CityEntity({
          ...city,
          region: city.region ? new RegionEntity(city.region) : undefined,
          zone: city.zone ? new ZoneEntity(city.zone) : undefined,
        }),
    );
  }

  async getAllCities(): Promise<CityEntity[]> {
    const cities = await this.prisma.city.findMany({
      include: {
        region: true,
        zone: true,
      },
    });
    return cities.map(
      (city) =>
        new CityEntity({
          ...city,
          region: city.region ? new RegionEntity(city.region) : undefined,
          zone: city.zone ? new ZoneEntity(city.zone) : undefined,
        }),
    );
  }

  async getActiveCities(): Promise<CityEntity[]> {
    const cities = await this.prisma.city.findMany({
      where: { isActive: true },
      include: {
        region: true,
        zone: true,
      },
    });
    return cities.map(
      (city) =>
        new CityEntity({
          ...city,
          region: city.region ? new RegionEntity(city.region) : undefined,
          zone: city.zone ? new ZoneEntity(city.zone) : undefined,
        }),
    );
  }

  async updateCity(id: string, city: Partial<CityEntity>): Promise<CityEntity> {
    const updatedCity = await this.prisma.city.update({
      where: { id },
      data: {
        name: city.name,
        regionId: city.regionId,
        zoneId: city.zoneId,
        cityType: city.cityType,
        municipalityName: city.municipalityName,
        municipalityPhone: city.municipalityPhone,
        municipalityEmail: city.municipalityEmail,
        latitude: city.latitude,
        longitude: city.longitude,
        isActive: city.isActive,
      },
      include: {
        region: true,
        zone: true,
      },
    });
    return new CityEntity({
      ...updatedCity,
      region: updatedCity.region
        ? new RegionEntity(updatedCity.region)
        : undefined,
      zone: updatedCity.zone ? new ZoneEntity(updatedCity.zone) : undefined,
    });
  }

  async softDeleteCity(id: string): Promise<CityEntity> {
    const updatedCity = await this.prisma.city.update({
      where: { id },
      data: { isActive: false },
      include: {
        region: true,
        zone: true,
      },
    });
    return new CityEntity({
      ...updatedCity,
      region: updatedCity.region
        ? new RegionEntity(updatedCity.region)
        : undefined,
      zone: updatedCity.zone ? new ZoneEntity(updatedCity.zone) : undefined,
    });
  }

  async hardDeleteCity(id: string): Promise<void> {
    await this.prisma.city.delete({
      where: { id },
    });
  }

  async cityExists(id: string): Promise<boolean> {
    const count = await this.prisma.city.count({
      where: { id },
    });
    return count > 0;
  }

  // ==================== Subcity Implementations ====================

  async createSubcity(subcity: Partial<SubcityEntity>): Promise<SubcityEntity> {
    const newSubcity = await this.prisma.subcity.create({
      data: {
        name: subcity.name!,
        code: subcity.code,
        cityId: subcity.cityId!,
        officeName: subcity.officeName,
        officePhone: subcity.officePhone,
        officeEmail: subcity.officeEmail,
        latitude: subcity.latitude,
        longitude: subcity.longitude,
        isActive: subcity.isActive ?? true,
      },
    });
    return new SubcityEntity(newSubcity);
  }

  async getSubcityById(id: string): Promise<SubcityEntity | null> {
    const subcity = await this.prisma.subcity.findUnique({
      where: { id },
      include: { city: true },
    });
    return subcity
      ? new SubcityEntity({
          ...subcity,
          city: subcity.city ? new CityEntity(subcity.city) : undefined,
        })
      : null;
  }

  async getSubcityByNameAndCity(
    name: string,
    cityId: string,
  ): Promise<SubcityEntity | null> {
    const subcity = await this.prisma.subcity.findFirst({
      where: {
        name,
        cityId,
      },
    });
    return subcity ? new SubcityEntity(subcity) : null;
  }

  async getSubcitiesByCity(cityId: string): Promise<SubcityEntity[]> {
    const subcities = await this.prisma.subcity.findMany({
      where: { cityId },
      include: { city: true },
    });
    return subcities.map(
      (subcity) =>
        new SubcityEntity({
          ...subcity,
          city: subcity.city ? new CityEntity(subcity.city) : undefined,
        }),
    );
  }

  async getAllSubcities(): Promise<SubcityEntity[]> {
    const subcities = await this.prisma.subcity.findMany({
      include: { city: true },
    });
    return subcities.map(
      (subcity) =>
        new SubcityEntity({
          ...subcity,
          city: subcity.city ? new CityEntity(subcity.city) : undefined,
        }),
    );
  }

  async updateSubcity(
    id: string,
    subcity: Partial<SubcityEntity>,
  ): Promise<SubcityEntity> {
    const updatedSubcity = await this.prisma.subcity.update({
      where: { id },
      data: {
        name: subcity.name,
        code: subcity.code,
        cityId: subcity.cityId,
        officeName: subcity.officeName,
        officePhone: subcity.officePhone,
        officeEmail: subcity.officeEmail,
        latitude: subcity.latitude,
        longitude: subcity.longitude,
        isActive: subcity.isActive,
      },
      include: { city: true },
    });
    return new SubcityEntity({
      ...updatedSubcity,
      city: updatedSubcity.city
        ? new CityEntity(updatedSubcity.city)
        : undefined,
    });
  }

  async softDeleteSubcity(id: string): Promise<SubcityEntity> {
    const updatedSubcity = await this.prisma.subcity.update({
      where: { id },
      data: { isActive: false },
      include: { city: true },
    });
    return new SubcityEntity({
      ...updatedSubcity,
      city: updatedSubcity.city
        ? new CityEntity(updatedSubcity.city)
        : undefined,
    });
  }

  async hardDeleteSubcity(id: string): Promise<void> {
    await this.prisma.subcity.delete({
      where: { id },
    });
  }

  async subcityExists(id: string): Promise<boolean> {
    const count = await this.prisma.subcity.count({
      where: { id },
    });
    return count > 0;
  }

  // ==================== Woreda Implementations ====================

  async createWoreda(woreda: Partial<WoredaEntity>): Promise<WoredaEntity> {
    const newWoreda = await this.prisma.woreda.create({
      data: {
        name: woreda.name!,
        number: woreda.number,
        regionId: woreda.regionId!,
        zoneId: woreda.zoneId,
        cityId: woreda.cityId,
        subcityId: woreda.subcityId,
        officeName: woreda.officeName,
        officePhone: woreda.officePhone,
        officeEmail: woreda.officeEmail,
        population: woreda.population,
        area: woreda.area,
        latitude: woreda.latitude,
        longitude: woreda.longitude,
        isActive: woreda.isActive ?? true,
      },
    });
    return new WoredaEntity(newWoreda);
  }

  async getWoredaById(id: string): Promise<WoredaEntity | null> {
    const woreda = await this.prisma.woreda.findUnique({
      where: { id },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
      },
    });
    return woreda
      ? new WoredaEntity({
          ...woreda,
          region: woreda.region ? new RegionEntity(woreda.region) : undefined,
          zone: woreda.zone ? new ZoneEntity(woreda.zone) : undefined,
          city: woreda.city ? new CityEntity(woreda.city) : undefined,
          subcity: woreda.subcity
            ? new SubcityEntity(woreda.subcity)
            : undefined,
        })
      : null;
  }

  async getWoredaByNameAndRegion(
    name: string,
    regionId: string,
  ): Promise<WoredaEntity | null> {
    const woreda = await this.prisma.woreda.findFirst({
      where: {
        name,
        regionId,
      },
    });
    return woreda ? new WoredaEntity(woreda) : null;
  }

  async getWoredasByRegion(regionId: string): Promise<WoredaEntity[]> {
    const woredas = await this.prisma.woreda.findMany({
      where: { regionId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
      },
    });
    return woredas.map(
      (woreda) =>
        new WoredaEntity({
          ...woreda,
          region: woreda.region ? new RegionEntity(woreda.region) : undefined,
          zone: woreda.zone ? new ZoneEntity(woreda.zone) : undefined,
          city: woreda.city ? new CityEntity(woreda.city) : undefined,
          subcity: woreda.subcity
            ? new SubcityEntity(woreda.subcity)
            : undefined,
        }),
    );
  }

  async getWoredasByZone(zoneId: string): Promise<WoredaEntity[]> {
    const woredas = await this.prisma.woreda.findMany({
      where: { zoneId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
      },
    });
    return woredas.map(
      (woreda) =>
        new WoredaEntity({
          ...woreda,
          region: woreda.region ? new RegionEntity(woreda.region) : undefined,
          zone: woreda.zone ? new ZoneEntity(woreda.zone) : undefined,
          city: woreda.city ? new CityEntity(woreda.city) : undefined,
          subcity: woreda.subcity
            ? new SubcityEntity(woreda.subcity)
            : undefined,
        }),
    );
  }

  async getWoredasByCity(cityId: string): Promise<WoredaEntity[]> {
    const woredas = await this.prisma.woreda.findMany({
      where: { cityId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
      },
    });
    return woredas.map(
      (woreda) =>
        new WoredaEntity({
          ...woreda,
          region: woreda.region ? new RegionEntity(woreda.region) : undefined,
          zone: woreda.zone ? new ZoneEntity(woreda.zone) : undefined,
          city: woreda.city ? new CityEntity(woreda.city) : undefined,
          subcity: woreda.subcity
            ? new SubcityEntity(woreda.subcity)
            : undefined,
        }),
    );
  }

  async getWoredasBySubcity(subcityId: string): Promise<WoredaEntity[]> {
    const woredas = await this.prisma.woreda.findMany({
      where: { subcityId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
      },
    });
    return woredas.map(
      (woreda) =>
        new WoredaEntity({
          ...woreda,
          region: woreda.region ? new RegionEntity(woreda.region) : undefined,
          zone: woreda.zone ? new ZoneEntity(woreda.zone) : undefined,
          city: woreda.city ? new CityEntity(woreda.city) : undefined,
          subcity: woreda.subcity
            ? new SubcityEntity(woreda.subcity)
            : undefined,
        }),
    );
  }

  async getAllWoredas(): Promise<WoredaEntity[]> {
    const woredas = await this.prisma.woreda.findMany({
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
      },
    });
    return woredas.map(
      (woreda) =>
        new WoredaEntity({
          ...woreda,
          region: woreda.region ? new RegionEntity(woreda.region) : undefined,
          zone: woreda.zone ? new ZoneEntity(woreda.zone) : undefined,
          city: woreda.city ? new CityEntity(woreda.city) : undefined,
          subcity: woreda.subcity
            ? new SubcityEntity(woreda.subcity)
            : undefined,
        }),
    );
  }

  async updateWoreda(
    id: string,
    woreda: Partial<WoredaEntity>,
  ): Promise<WoredaEntity> {
    const updatedWoreda = await this.prisma.woreda.update({
      where: { id },
      data: {
        name: woreda.name,
        number: woreda.number,
        regionId: woreda.regionId,
        zoneId: woreda.zoneId,
        cityId: woreda.cityId,
        subcityId: woreda.subcityId,
        officeName: woreda.officeName,
        officePhone: woreda.officePhone,
        officeEmail: woreda.officeEmail,
        population: woreda.population,
        area: woreda.area,
        latitude: woreda.latitude,
        longitude: woreda.longitude,
        isActive: woreda.isActive,
      },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
      },
    });
    return new WoredaEntity({
      ...updatedWoreda,
      region: updatedWoreda.region
        ? new RegionEntity(updatedWoreda.region)
        : undefined,
      zone: updatedWoreda.zone ? new ZoneEntity(updatedWoreda.zone) : undefined,
      city: updatedWoreda.city ? new CityEntity(updatedWoreda.city) : undefined,
      subcity: updatedWoreda.subcity
        ? new SubcityEntity(updatedWoreda.subcity)
        : undefined,
    });
  }

  async softDeleteWoreda(id: string): Promise<WoredaEntity> {
    const updatedWoreda = await this.prisma.woreda.update({
      where: { id },
      data: { isActive: false },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
      },
    });
    return new WoredaEntity({
      ...updatedWoreda,
      region: updatedWoreda.region
        ? new RegionEntity(updatedWoreda.region)
        : undefined,
      zone: updatedWoreda.zone ? new ZoneEntity(updatedWoreda.zone) : undefined,
      city: updatedWoreda.city ? new CityEntity(updatedWoreda.city) : undefined,
      subcity: updatedWoreda.subcity
        ? new SubcityEntity(updatedWoreda.subcity)
        : undefined,
    });
  }

  async hardDeleteWoreda(id: string): Promise<void> {
    await this.prisma.woreda.delete({
      where: { id },
    });
  }

  async woredaExists(id: string): Promise<boolean> {
    const count = await this.prisma.woreda.count({
      where: { id },
    });
    return count > 0;
  }

  // ==================== Kebele Implementations ====================

  async createKebele(kebele: Partial<KebeleEntity>): Promise<KebeleEntity> {
    const newKebele = await this.prisma.kebele.create({
      data: {
        name: kebele.name!,
        number: kebele.number,
        regionId: kebele.regionId!,
        zoneId: kebele.zoneId,
        cityId: kebele.cityId,
        subcityId: kebele.subcityId,
        woredaId: kebele.woredaId,
        officeName: kebele.officeName,
        officePhone: kebele.officePhone,
        officeEmail: kebele.officeEmail,
        officialName: kebele.officialName,
        officialTitle: kebele.officialTitle,
        officialPhone: kebele.officialPhone,
        population: kebele.population,
        area: kebele.area,
        sealImage: kebele.sealImage,
        sealCode: kebele.sealCode,
        latitude: kebele.latitude,
        longitude: kebele.longitude,
        // isActive: kebele.isActive ?? true,
        hasDigitalSeal: kebele.hasDigitalSeal ?? false,
      },
    });
    return new KebeleEntity(newKebele);
  }

  async getKebeleById(id: string): Promise<KebeleEntity | null> {
    const kebele = await this.prisma.kebele.findUnique({
      where: { id },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return kebele
      ? new KebeleEntity({
          ...kebele,
          region: kebele.region ? new RegionEntity(kebele.region) : undefined,
          zone: kebele.zone ? new ZoneEntity(kebele.zone) : undefined,
          city: kebele.city ? new CityEntity(kebele.city) : undefined,
          subcity: kebele.subcity
            ? new SubcityEntity(kebele.subcity)
            : undefined,
          woreda: kebele.woreda ? new WoredaEntity(kebele.woreda) : undefined,
        })
      : null;
  }

  async getKebeleByNameAndWoreda(
    name: string,
    woredaId: string,
  ): Promise<KebeleEntity | null> {
    const kebele = await this.prisma.kebele.findFirst({
      where: {
        name,
        woredaId,
      },
    });
    return kebele ? new KebeleEntity(kebele) : null;
  }

  async getKebelesByRegion(regionId: string): Promise<KebeleEntity[]> {
    const kebeles = await this.prisma.kebele.findMany({
      where: { regionId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return kebeles.map(
      (kebele) =>
        new KebeleEntity({
          ...kebele,
          region: kebele.region ? new RegionEntity(kebele.region) : undefined,
          zone: kebele.zone ? new ZoneEntity(kebele.zone) : undefined,
          city: kebele.city ? new CityEntity(kebele.city) : undefined,
          subcity: kebele.subcity
            ? new SubcityEntity(kebele.subcity)
            : undefined,
          woreda: kebele.woreda ? new WoredaEntity(kebele.woreda) : undefined,
        }),
    );
  }

  async getKebelesByZone(zoneId: string): Promise<KebeleEntity[]> {
    const kebeles = await this.prisma.kebele.findMany({
      where: { zoneId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return kebeles.map(
      (kebele) =>
        new KebeleEntity({
          ...kebele,
          region: kebele.region ? new RegionEntity(kebele.region) : undefined,
          zone: kebele.zone ? new ZoneEntity(kebele.zone) : undefined,
          city: kebele.city ? new CityEntity(kebele.city) : undefined,
          subcity: kebele.subcity
            ? new SubcityEntity(kebele.subcity)
            : undefined,
          woreda: kebele.woreda ? new WoredaEntity(kebele.woreda) : undefined,
        }),
    );
  }

  async getKebelesByCity(cityId: string): Promise<KebeleEntity[]> {
    const kebeles = await this.prisma.kebele.findMany({
      where: { cityId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return kebeles.map(
      (kebele) =>
        new KebeleEntity({
          ...kebele,
          region: kebele.region ? new RegionEntity(kebele.region) : undefined,
          zone: kebele.zone ? new ZoneEntity(kebele.zone) : undefined,
          city: kebele.city ? new CityEntity(kebele.city) : undefined,
          subcity: kebele.subcity
            ? new SubcityEntity(kebele.subcity)
            : undefined,
          woreda: kebele.woreda ? new WoredaEntity(kebele.woreda) : undefined,
        }),
    );
  }

  async getKebelesBySubcity(subcityId: string): Promise<KebeleEntity[]> {
    const kebeles = await this.prisma.kebele.findMany({
      where: { subcityId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return kebeles.map(
      (kebele) =>
        new KebeleEntity({
          ...kebele,
          region: kebele.region ? new RegionEntity(kebele.region) : undefined,
          zone: kebele.zone ? new ZoneEntity(kebele.zone) : undefined,
          city: kebele.city ? new CityEntity(kebele.city) : undefined,
          subcity: kebele.subcity
            ? new SubcityEntity(kebele.subcity)
            : undefined,
          woreda: kebele.woreda ? new WoredaEntity(kebele.woreda) : undefined,
        }),
    );
  }

  async getKebelesByWoreda(woredaId: string): Promise<KebeleEntity[]> {
    const kebeles = await this.prisma.kebele.findMany({
      where: { woredaId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return kebeles.map(
      (kebele) =>
        new KebeleEntity({
          ...kebele,
          region: kebele.region ? new RegionEntity(kebele.region) : undefined,
          zone: kebele.zone ? new ZoneEntity(kebele.zone) : undefined,
          city: kebele.city ? new CityEntity(kebele.city) : undefined,
          subcity: kebele.subcity
            ? new SubcityEntity(kebele.subcity)
            : undefined,
          woreda: kebele.woreda ? new WoredaEntity(kebele.woreda) : undefined,
        }),
    );
  }

  async getAllKebeles(): Promise<KebeleEntity[]> {
    const kebeles = await this.prisma.kebele.findMany({
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return kebeles.map(
      (kebele) =>
        new KebeleEntity({
          ...kebele,
          region: kebele.region ? new RegionEntity(kebele.region) : undefined,
          zone: kebele.zone ? new ZoneEntity(kebele.zone) : undefined,
          city: kebele.city ? new CityEntity(kebele.city) : undefined,
          subcity: kebele.subcity
            ? new SubcityEntity(kebele.subcity)
            : undefined,
          woreda: kebele.woreda ? new WoredaEntity(kebele.woreda) : undefined,
        }),
    );
  }

  async getKebelesWithDigitalSeal(): Promise<KebeleEntity[]> {
    const kebeles = await this.prisma.kebele.findMany({
      where: { hasDigitalSeal: true },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return kebeles.map(
      (kebele) =>
        new KebeleEntity({
          ...kebele,
          region: kebele.region ? new RegionEntity(kebele.region) : undefined,
          zone: kebele.zone ? new ZoneEntity(kebele.zone) : undefined,
          city: kebele.city ? new CityEntity(kebele.city) : undefined,
          subcity: kebele.subcity
            ? new SubcityEntity(kebele.subcity)
            : undefined,
          woreda: kebele.woreda ? new WoredaEntity(kebele.woreda) : undefined,
        }),
    );
  }

  async updateKebele(
    id: string,
    kebele: Partial<KebeleEntity>,
  ): Promise<KebeleEntity> {
    const updatedKebele = await this.prisma.kebele.update({
      where: { id },
      data: {
        name: kebele.name,
        number: kebele.number,
        regionId: kebele.regionId,
        zoneId: kebele.zoneId,
        cityId: kebele.cityId,
        subcityId: kebele.subcityId,
        woredaId: kebele.woredaId,
        officeName: kebele.officeName,
        officePhone: kebele.officePhone,
        officeEmail: kebele.officeEmail,
        officialName: kebele.officialName,
        officialTitle: kebele.officialTitle,
        officialPhone: kebele.officialPhone,
        population: kebele.population,
        area: kebele.area,
        sealImage: kebele.sealImage,
        sealCode: kebele.sealCode,
        latitude: kebele.latitude,
        longitude: kebele.longitude,
        isActive: kebele.isActive,
        hasDigitalSeal: kebele.hasDigitalSeal,
      },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return new KebeleEntity({
      ...updatedKebele,
      region: updatedKebele.region
        ? new RegionEntity(updatedKebele.region)
        : undefined,
      zone: updatedKebele.zone ? new ZoneEntity(updatedKebele.zone) : undefined,
      city: updatedKebele.city ? new CityEntity(updatedKebele.city) : undefined,
      subcity: updatedKebele.subcity
        ? new SubcityEntity(updatedKebele.subcity)
        : undefined,
      woreda: updatedKebele.woreda
        ? new WoredaEntity(updatedKebele.woreda)
        : undefined,
    });
  }

  async softDeleteKebele(id: string): Promise<KebeleEntity> {
    const updatedKebele = await this.prisma.kebele.update({
      where: { id },
      data: { isActive: false },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });
    return new KebeleEntity({
      ...updatedKebele,
      region: updatedKebele.region
        ? new RegionEntity(updatedKebele.region)
        : undefined,
      zone: updatedKebele.zone ? new ZoneEntity(updatedKebele.zone) : undefined,
      city: updatedKebele.city ? new CityEntity(updatedKebele.city) : undefined,
      subcity: updatedKebele.subcity
        ? new SubcityEntity(updatedKebele.subcity)
        : undefined,
      woreda: updatedKebele.woreda
        ? new WoredaEntity(updatedKebele.woreda)
        : undefined,
    });
  }

  async hardDeleteKebele(id: string): Promise<void> {
    await this.prisma.kebele.delete({
      where: { id },
    });
  }

  async kebeleExists(id: string): Promise<boolean> {
    const count = await this.prisma.kebele.count({
      where: { id },
    });
    return count > 0;
  }

  async kebeleHasDigitalSeal(id: string): Promise<boolean> {
    const kebele = await this.prisma.kebele.findUnique({
      where: { id },
      select: { hasDigitalSeal: true },
    });
    return kebele?.hasDigitalSeal ?? false;
  }

  // ==================== Helper Methods ====================

  async getFullLocationHierarchy(kebeleId: string): Promise<{
    region: RegionEntity | null;
    zone: ZoneEntity | null;
    city: CityEntity | null;
    subcity: SubcityEntity | null;
    woreda: WoredaEntity | null;
    kebele: KebeleEntity | null;
  }> {
    const kebele = await this.prisma.kebele.findUnique({
      where: { id: kebeleId },
      include: {
        region: true,
        zone: true,
        city: true,
        subcity: true,
        woreda: true,
      },
    });

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

    // ⚠️ ችግሩ እዚህ ነው - kebele ራሱን በቀጥታ ስንጠቀም
    return {
      region: kebele.region
        ? new RegionEntity({
            id: kebele.region.id,
            name: kebele.region.name,
            code: kebele.region.code,
            createdAt: kebele.region.createdAt,
            updatedAt: kebele.region.updatedAt,
          })
        : null,

      // 👇 የ zone ን በተናጠል አዘጋጅ
      zone: kebele.zone
        ? new ZoneEntity({
            id: kebele.zone.id,
            name: kebele.zone.name,
            code: kebele.zone.code,
            regionId: kebele.zone.regionId,
            createdAt: kebele.zone.createdAt,
            updatedAt: kebele.zone.updatedAt,
          })
        : null,

      // 👇 የ city ን በተናጠል አዘጋጅ
      city: kebele.city
        ? new CityEntity({
            id: kebele.city.id,
            name: kebele.city.name,
            regionId: kebele.city.regionId,
            zoneId: kebele.city.zoneId,
            cityType: kebele.city.cityType,
            municipalityName: kebele.city.municipalityName,
            municipalityPhone: kebele.city.municipalityPhone,
            municipalityEmail: kebele.city.municipalityEmail,
            latitude: kebele.city.latitude,
            longitude: kebele.city.longitude,
            isActive: kebele.city.isActive,
            createdAt: kebele.city.createdAt,
            updatedAt: kebele.city.updatedAt,
          })
        : null,

      // 👇 የ subcity ን በተናጠል አዘጋጅ
      subcity: kebele.subcity
        ? new SubcityEntity({
            id: kebele.subcity.id,
            name: kebele.subcity.name,
            code: kebele.subcity.code,
            cityId: kebele.subcity.cityId,
            officeName: kebele.subcity.officeName,
            officePhone: kebele.subcity.officePhone,
            officeEmail: kebele.subcity.officeEmail,
            latitude: kebele.subcity.latitude,
            longitude: kebele.subcity.longitude,
            isActive: kebele.subcity.isActive,
            createdAt: kebele.subcity.createdAt,
            updatedAt: kebele.subcity.updatedAt,
          })
        : null,

      // 👇 የ woreda ን በተናጠል አዘጋጅ
      woreda: kebele.woreda
        ? new WoredaEntity({
            id: kebele.woreda.id,
            name: kebele.woreda.name,
            number: kebele.woreda.number,
            regionId: kebele.woreda.regionId,
            zoneId: kebele.woreda.zoneId,
            cityId: kebele.woreda.cityId,
            subcityId: kebele.woreda.subcityId,
            officeName: kebele.woreda.officeName,
            officePhone: kebele.woreda.officePhone,
            officeEmail: kebele.woreda.officeEmail,
            population: kebele.woreda.population,
            area: kebele.woreda.area,
            latitude: kebele.woreda.latitude,
            longitude: kebele.woreda.longitude,
            isActive: kebele.woreda.isActive,
            createdAt: kebele.woreda.createdAt,
            updatedAt: kebele.woreda.updatedAt,
          })
        : null,

      // 👇 የ kebele ን በተናጠል አዘጋጅ
      kebele: new KebeleEntity({
        id: kebele.id,
        name: kebele.name,
        number: kebele.number,
        regionId: kebele.regionId,
        zoneId: kebele.zoneId,
        cityId: kebele.cityId,
        subcityId: kebele.subcityId,
        woredaId: kebele.woredaId,
        officeName: kebele.officeName,
        officePhone: kebele.officePhone,
        officeEmail: kebele.officeEmail,
        officialName: kebele.officialName,
        officialTitle: kebele.officialTitle,
        officialPhone: kebele.officialPhone,
        population: kebele.population,
        area: kebele.area,
        sealImage: kebele.sealImage,
        sealCode: kebele.sealCode,
        latitude: kebele.latitude,
        longitude: kebele.longitude,
        isActive: kebele.isActive,
        hasDigitalSeal: kebele.hasDigitalSeal,
        createdAt: kebele.createdAt,
        updatedAt: kebele.updatedAt,
      }),
    };
  }

  async getRegionHierarchy(regionId: string): Promise<{
    region: RegionEntity | null;
    zones: ZoneEntity[];
    cities: CityEntity[];
    subcities: SubcityEntity[];
    woredas: WoredaEntity[];
    kebeles: KebeleEntity[];
  }> {
    const region = await this.prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      return {
        region: null,
        zones: [],
        cities: [],
        subcities: [],
        woredas: [],
        kebeles: [],
      };
    }

    const [zones, cities, woredas, kebeles] = await Promise.all([
      this.prisma.zone.findMany({ where: { regionId } }),
      this.prisma.city.findMany({ where: { regionId } }),
      this.prisma.woreda.findMany({ where: { regionId } }),
      this.prisma.kebele.findMany({ where: { regionId } }),
    ]);

    // Subcities ለማግኘት በከተሞች መፈለግ አለብን
    const subcities = await this.prisma.subcity.findMany({
      where: {
        cityId: {
          in: cities.map((c) => c.id),
        },
      },
    });

    return {
      region: new RegionEntity(region),
      zones: zones.map((z) => new ZoneEntity(z)),
      cities: cities.map((c) => new CityEntity(c)),
      subcities: subcities.map((s) => new SubcityEntity(s)),
      woredas: woredas.map((w) => new WoredaEntity(w)),
      kebeles: kebeles.map((k) => new KebeleEntity(k)),
    };
  }
}
