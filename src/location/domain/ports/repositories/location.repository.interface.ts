import { RegionEntity } from '../../entities/region.entity';
import { ZoneEntity } from '../../entities/zone.entity';
import { CityEntity } from '../../entities/city.entity';
import { SubcityEntity } from '../../entities/subcity.entity';
import { WoredaEntity } from '../../entities/woreda.entity';
import { KebeleEntity } from '../../entities/kebele.entity';

export interface ILocationRepository {
  
  // ==================== Region Methods ====================
  
  // አዲስ ክልል መፍጠር
  createRegion(region: Partial<RegionEntity>): Promise<RegionEntity>;
  
  // ክልል በID ማግኘት
  getRegionById(id: string): Promise<RegionEntity | null>;
  
  // ክልል በስም ማግኘት
  getRegionByName(name: string): Promise<RegionEntity | null>;
  
  // ክልል በኮድ ማግኘት
  getRegionByCode(code: string): Promise<RegionEntity | null>;
  
  // ሁሉንም ክልሎች ማግኘት
  getAllRegions(): Promise<RegionEntity[]>;
  
  // ንቁ የሆኑ ክልሎችን ማግኘት (isActive = true)
  getActiveRegions(): Promise<RegionEntity[]>;
  
  // ክልል ማዘመን
  updateRegion(id: string, region: Partial<RegionEntity>): Promise<RegionEntity>;
  
  // ክልል መሰረዝ (ለስላሳ ሰርዝ - soft delete)
  softDeleteRegion(id: string): Promise<RegionEntity>;
  
  // ክልል ሙሉ በሙሉ መሰረዝ (hard delete - ለሱፐር አድሚን ብቻ)
  hardDeleteRegion(id: string): Promise<void>;
  
  // ክልል መኖሩን ማረጋገጥ
  regionExists(id: string): Promise<boolean>;
  
  // ክልል በስም መኖሩን ማረጋገጥ
  regionExistsByName(name: string): Promise<boolean>;

  // ==================== Zone Methods ====================
  
  // አዲስ ዞን መፍጠር
  createZone(zone: Partial<ZoneEntity>): Promise<ZoneEntity>;
  
  // ዞን በID ማግኘት
  getZoneById(id: string): Promise<ZoneEntity | null>;
  
  // ዞን በስም እና በክልል ማግኘት
  getZoneByNameAndRegion(name: string, regionId: string): Promise<ZoneEntity | null>;
  
  // በክልል የሚገኙ ዞኖችን ማግኘት
  getZonesByRegion(regionId: string): Promise<ZoneEntity[]>;
  
  // ሁሉንም ዞኖች ማግኘት
  getAllZones(): Promise<ZoneEntity[]>;
  
  // ዞን ማዘመን
  updateZone(id: string, zone: Partial<ZoneEntity>): Promise<ZoneEntity>;
  
  // ዞን መሰረዝ (ለስላሳ ሰርዝ)
  softDeleteZone(id: string): Promise<ZoneEntity>;
  
  // ዞን ሙሉ በሙሉ መሰረዝ
  hardDeleteZone(id: string): Promise<void>;
  
  // ዞን መኖሩን ማረጋገጥ
  zoneExists(id: string): Promise<boolean>;
  
  // ዞን በስም መኖሩን ማረጋገጥ
  zoneExistsByName(name: string, regionId: string): Promise<boolean>;

  // ==================== City Methods ====================
  
  // አዲስ ከተማ መፍጠር
  createCity(city: Partial<CityEntity>): Promise<CityEntity>;
  
  // ከተማ በID ማግኘት
  getCityById(id: string): Promise<CityEntity | null>;
  
  // ከተማ በስም እና በክልል ማግኘት
  getCityByNameAndRegion(name: string, regionId: string): Promise<CityEntity | null>;
  
  // በክልል የሚገኙ ከተሞችን ማግኘት
  getCitiesByRegion(regionId: string): Promise<CityEntity[]>;
  
  // በዞን የሚገኙ ከተሞችን ማግኘት
  getCitiesByZone(zoneId: string): Promise<CityEntity[]>;
  
  // ሁሉንም ከተሞች ማግኘት
  getAllCities(): Promise<CityEntity[]>;
  
  // ንቁ የሆኑ ከተሞችን ማግኘት
  getActiveCities(): Promise<CityEntity[]>;
  
  // ከተማ ማዘመን
  updateCity(id: string, city: Partial<CityEntity>): Promise<CityEntity>;
  
  // ከተማ መሰረዝ (ለስላሳ ሰርዝ)
  softDeleteCity(id: string): Promise<CityEntity>;
  
  // ከተማ ሙሉ በሙሉ መሰረዝ
  hardDeleteCity(id: string): Promise<void>;
  
  // ከተማ መኖሩን ማረጋገጥ
  cityExists(id: string): Promise<boolean>;

  // ==================== Subcity Methods ====================
  
  // አዲስ ክፍለ ከተማ መፍጠር
  createSubcity(subcity: Partial<SubcityEntity>): Promise<SubcityEntity>;
  
  // ክፍለ ከተማ በID ማግኘት
  getSubcityById(id: string): Promise<SubcityEntity | null>;
  
  // ክፍለ ከተማ በስም እና በከተማ ማግኘት
  getSubcityByNameAndCity(name: string, cityId: string): Promise<SubcityEntity | null>;
  
  // በከተማ የሚገኙ ክፍለ ከተሞችን ማግኘት
  getSubcitiesByCity(cityId: string): Promise<SubcityEntity[]>;
  
  // ሁሉንም ክፍለ ከተሞች ማግኘት
  getAllSubcities(): Promise<SubcityEntity[]>;
  
  // ክፍለ ከተማ ማዘመን
  updateSubcity(id: string, subcity: Partial<SubcityEntity>): Promise<SubcityEntity>;
  
  // ክፍለ ከተማ መሰረዝ (ለስላሳ ሰርዝ)
  softDeleteSubcity(id: string): Promise<SubcityEntity>;
  
  // ክፍለ ከተማ ሙሉ በሙሉ መሰረዝ
  hardDeleteSubcity(id: string): Promise<void>;
  
  // ክፍለ ከተማ መኖሩን ማረጋገጥ
  subcityExists(id: string): Promise<boolean>;

  // ==================== Woreda Methods ====================
  
  // አዲስ ወረዳ መፍጠር
  createWoreda(woreda: Partial<WoredaEntity>): Promise<WoredaEntity>;
  
  // ወረዳ በID ማግኘት
  getWoredaById(id: string): Promise<WoredaEntity | null>;
  
  // ወረዳ በስም እና በክልል ማግኘት
  getWoredaByNameAndRegion(name: string, regionId: string): Promise<WoredaEntity | null>;
  
  // በክልል የሚገኙ ወረዳዎችን ማግኘት
  getWoredasByRegion(regionId: string): Promise<WoredaEntity[]>;
  
  // በዞን የሚገኙ ወረዳዎችን ማግኘት
  getWoredasByZone(zoneId: string): Promise<WoredaEntity[]>;
  
  // በከተማ የሚገኙ ወረዳዎችን ማግኘት
  getWoredasByCity(cityId: string): Promise<WoredaEntity[]>;
  
  // በክፍለ ከተማ የሚገኙ ወረዳዎችን ማግኘት
  getWoredasBySubcity(subcityId: string): Promise<WoredaEntity[]>;
  
  // ሁሉንም ወረዳዎች ማግኘት
  getAllWoredas(): Promise<WoredaEntity[]>;
  
  // ወረዳ ማዘመን
  updateWoreda(id: string, woreda: Partial<WoredaEntity>): Promise<WoredaEntity>;
  
  // ወረዳ መሰረዝ (ለስላሳ ሰርዝ)
  softDeleteWoreda(id: string): Promise<WoredaEntity>;
  
  // ወረዳ ሙሉ በሙሉ መሰረዝ
  hardDeleteWoreda(id: string): Promise<void>;
  
  // ወረዳ መኖሩን ማረጋገጥ
  woredaExists(id: string): Promise<boolean>;

  // ==================== Kebele Methods ====================
  
  // አዲስ ቀበሌ መፍጠር
  createKebele(kebele: Partial<KebeleEntity>): Promise<KebeleEntity>;
  
  // ቀበሌ በID ማግኘት
  getKebeleById(id: string): Promise<KebeleEntity | null>;
  
  // ቀበሌ በስም እና በወረዳ ማግኘት
  getKebeleByNameAndWoreda(name: string, woredaId: string): Promise<KebeleEntity | null>;
  
  // በክልል የሚገኙ ቀበሌዎችን ማግኘት
  getKebelesByRegion(regionId: string): Promise<KebeleEntity[]>;
  
  // በዞን የሚገኙ ቀበሌዎችን ማግኘት
  getKebelesByZone(zoneId: string): Promise<KebeleEntity[]>;
  
  // በከተማ የሚገኙ ቀበሌዎችን ማግኘት
  getKebelesByCity(cityId: string): Promise<KebeleEntity[]>;
  
  // በክፍለ ከተማ የሚገኙ ቀበሌዎችን ማግኘት
  getKebelesBySubcity(subcityId: string): Promise<KebeleEntity[]>;
  
  // በወረዳ የሚገኙ ቀበሌዎችን ማግኘት
  getKebelesByWoreda(woredaId: string): Promise<KebeleEntity[]>;
  
  // ሁሉንም ቀበሌዎች ማግኘት
  getAllKebeles(): Promise<KebeleEntity[]>;
  
  // ዲጂታል ማህተም ያላቸውን ቀበሌዎች ማግኘት
  getKebelesWithDigitalSeal(): Promise<KebeleEntity[]>;
  
  // ቀበሌ ማዘመን
  updateKebele(id: string, kebele: Partial<KebeleEntity>): Promise<KebeleEntity>;
  
  // ቀበሌ መሰረዝ (ለስላሳ ሰርዝ)
  softDeleteKebele(id: string): Promise<KebeleEntity>;
  
  // ቀበሌ ሙሉ በሙሉ መሰረዝ
  hardDeleteKebele(id: string): Promise<void>;
  
  // ቀበሌ መኖሩን ማረጋገጥ
  kebeleExists(id: string): Promise<boolean>;
  
  // ቀበሌ ዲጂታል ማህተም እንዳለው ማረጋገጥ
  kebeleHasDigitalSeal(id: string): Promise<boolean>;

  // ==================== Helper Methods for Hierarchical Data ====================
  
  // ሙሉ የአካባቢ ተዋረድ ማግኘት (ከክልል እስከ ቀበሌ)
  getFullLocationHierarchy(kebeleId: string): Promise<{
    region: RegionEntity | null;
    zone: ZoneEntity | null;
    city: CityEntity | null;
    subcity: SubcityEntity | null;
    woreda: WoredaEntity | null;
    kebele: KebeleEntity | null;
  }>;
  
  // በክልል ስር ያሉትን ሁሉንም አካባቢዎች ማግኘት
  getRegionHierarchy(regionId: string): Promise<{
    region: RegionEntity | null;
    zones: ZoneEntity[];
    cities: CityEntity[];
    subcities: SubcityEntity[];
    woredas: WoredaEntity[];
    kebeles: KebeleEntity[];
  }>;
}