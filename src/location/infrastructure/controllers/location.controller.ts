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
  UseGuards
} from '@nestjs/common';
import { LocationUseCase } from '../../application/use-cases/location.use-case';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.enum';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

// DTOs
import { CreateRegionDto, UpdateRegionDto, RegionResponseDto } from '../../application/dtos/region.dto';
import { CreateZoneDto, UpdateZoneDto, ZoneResponseDto } from '../../application/dtos/zone.dto';
import { CreateCityDto, UpdateCityDto, CityResponseDto } from '../../application/dtos/city.dto';
import { CreateSubcityDto, UpdateSubcityDto, SubcityResponseDto } from '../../application/dtos/subcity.dto';
import { CreateWoredaDto, UpdateWoredaDto, WoredaResponseDto } from '../../application/dtos/woreda.dto';
import { CreateKebeleDto, UpdateKebeleDto, KebeleResponseDto } from '../../application/dtos/kebele.dto';

@Controller('locations')
@UseGuards(AuthGuard, RolesGuard)
export class LocationController {
  constructor(private readonly locationUseCase: LocationUseCase) {}

  // ==================== Region Endpoints ====================

  @Post('regions')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createRegionController(@Body() createRegionDto: CreateRegionDto): Promise<RegionResponseDto> {
    return await this.locationUseCase.createRegion(createRegionDto);
  }

  @Get('regions')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getAllRegionsController(): Promise<RegionResponseDto[]> {
    return await this.locationUseCase.getAllRegions();
  }

  @Get('regions/active')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getActiveRegionsController(): Promise<RegionResponseDto[]> {
    return await this.locationUseCase.getActiveRegions();
  }

  @Get('regions/:id')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getRegionByIdController(@Param('id') id: string): Promise<RegionResponseDto> {
    return await this.locationUseCase.getRegionById(id);
  }

  @Get('regions/name/:name')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getRegionByNameController(@Param('name') name: string): Promise<RegionResponseDto> {
    return await this.locationUseCase.getRegionByName(name);
  }

  @Get('regions/code/:code')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getRegionByCodeController(@Param('code') code: string): Promise<RegionResponseDto> {
    return await this.locationUseCase.getRegionByCode(code);
  }

  @Put('regions/:id')
  @Roles(Role.SUPER_ADMIN)
  async updateRegionController(
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ): Promise<RegionResponseDto> {
    return await this.locationUseCase.updateRegion(id, updateRegionDto);
  }

  @Delete('regions/:id/soft')
  @Roles(Role.SUPER_ADMIN)
  async softDeleteRegionController(@Param('id') id: string): Promise<RegionResponseDto> {
    return await this.locationUseCase.softDeleteRegion(id);
  }

  @Delete('regions/:id/hard')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDeleteRegionController(@Param('id') id: string): Promise<void> {
    await this.locationUseCase.hardDeleteRegion(id);
  }

  // ==================== Zone Endpoints ====================

  @Post('zones')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createZoneController(@Body() createZoneDto: CreateZoneDto): Promise<ZoneResponseDto> {
    return await this.locationUseCase.createZone(createZoneDto);
  }

  @Get('zones')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getAllZonesController(): Promise<ZoneResponseDto[]> {
    return await this.locationUseCase.getAllZones();
  }

  @Get('zones/:id')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getZoneByIdController(@Param('id') id: string): Promise<ZoneResponseDto> {
    return await this.locationUseCase.getZoneById(id);
  }

  @Get('regions/:regionId/zones')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getZonesByRegionController(@Param('regionId') regionId: string): Promise<ZoneResponseDto[]> {
    return await this.locationUseCase.getZonesByRegion(regionId);
  }

  @Put('zones/:id')
  @Roles(Role.SUPER_ADMIN)
  async updateZoneController(
    @Param('id') id: string,
    @Body() updateZoneDto: UpdateZoneDto,
  ): Promise<ZoneResponseDto> {
    return await this.locationUseCase.updateZone(id, updateZoneDto);
  }

  @Delete('zones/:id/soft')
  @Roles(Role.SUPER_ADMIN)
  async softDeleteZoneController(@Param('id') id: string): Promise<ZoneResponseDto> {
    return await this.locationUseCase.softDeleteZone(id);
  }

  @Delete('zones/:id/hard')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDeleteZoneController(@Param('id') id: string): Promise<void> {
    await this.locationUseCase.hardDeleteZone(id);
  }

  // ==================== City Endpoints ====================

  @Post('cities')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createCityController(@Body() createCityDto: CreateCityDto): Promise<CityResponseDto> {
    return await this.locationUseCase.createCity(createCityDto);
  }

  @Get('cities')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getAllCitiesController(): Promise<CityResponseDto[]> {
    return await this.locationUseCase.getAllCities();
  }

  @Get('cities/active')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getActiveCitiesController(): Promise<CityResponseDto[]> {
    return await this.locationUseCase.getActiveCities();
  }

  @Get('cities/:id')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getCityByIdController(@Param('id') id: string): Promise<CityResponseDto> {
    return await this.locationUseCase.getCityById(id);
  }

  @Get('regions/:regionId/cities')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getCitiesByRegionController(@Param('regionId') regionId: string): Promise<CityResponseDto[]> {
    return await this.locationUseCase.getCitiesByRegion(regionId);
  }

  @Get('zones/:zoneId/cities')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getCitiesByZoneController(@Param('zoneId') zoneId: string): Promise<CityResponseDto[]> {
    return await this.locationUseCase.getCitiesByZone(zoneId);
  }

  @Put('cities/:id')
  @Roles(Role.SUPER_ADMIN)
  async updateCityController(
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<CityResponseDto> {
    return await this.locationUseCase.updateCity(id, updateCityDto);
  }

  @Delete('cities/:id/soft')
  @Roles(Role.SUPER_ADMIN)
  async softDeleteCityController(@Param('id') id: string): Promise<CityResponseDto> {
    return await this.locationUseCase.softDeleteCity(id);
  }

  @Delete('cities/:id/hard')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDeleteCityController(@Param('id') id: string): Promise<void> {
    await this.locationUseCase.hardDeleteCity(id);
  }

  // ==================== Subcity Endpoints ====================

  @Post('subcities')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createSubcityController(@Body() createSubcityDto: CreateSubcityDto): Promise<SubcityResponseDto> {
    return await this.locationUseCase.createSubcity(createSubcityDto);
  }

  @Get('subcities')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getAllSubcitiesController(): Promise<SubcityResponseDto[]> {
    return await this.locationUseCase.getAllSubcities();
  }

  @Get('subcities/:id')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getSubcityByIdController(@Param('id') id: string): Promise<SubcityResponseDto> {
    return await this.locationUseCase.getSubcityById(id);
  }

  @Get('cities/:cityId/subcities')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getSubcitiesByCityController(@Param('cityId') cityId: string): Promise<SubcityResponseDto[]> {
    return await this.locationUseCase.getSubcitiesByCity(cityId);
  }

  @Put('subcities/:id')
  @Roles(Role.SUPER_ADMIN)
  async updateSubcityController(
    @Param('id') id: string,
    @Body() updateSubcityDto: UpdateSubcityDto,
  ): Promise<SubcityResponseDto> {
    return await this.locationUseCase.updateSubcity(id, updateSubcityDto);
  }

  @Delete('subcities/:id/soft')
  @Roles(Role.SUPER_ADMIN)
  async softDeleteSubcityController(@Param('id') id: string): Promise<SubcityResponseDto> {
    return await this.locationUseCase.softDeleteSubcity(id);
  }

  @Delete('subcities/:id/hard')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDeleteSubcityController(@Param('id') id: string): Promise<void> {
    await this.locationUseCase.hardDeleteSubcity(id);
  }

  // ==================== Woreda Endpoints ====================

  @Post('woredas')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createWoredaController(@Body() createWoredaDto: CreateWoredaDto): Promise<WoredaResponseDto> {
    return await this.locationUseCase.createWoreda(createWoredaDto);
  }

  @Get('woredas')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getAllWoredasController(): Promise<WoredaResponseDto[]> {
    return await this.locationUseCase.getAllWoredas();
  }

  @Get('woredas/:id')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getWoredaByIdController(@Param('id') id: string): Promise<WoredaResponseDto> {
    return await this.locationUseCase.getWoredaById(id);
  }

  @Get('regions/:regionId/woredas')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getWoredasByRegionController(@Param('regionId') regionId: string): Promise<WoredaResponseDto[]> {
    return await this.locationUseCase.getWoredasByRegion(regionId);
  }

  @Get('zones/:zoneId/woredas')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getWoredasByZoneController(@Param('zoneId') zoneId: string): Promise<WoredaResponseDto[]> {
    return await this.locationUseCase.getWoredasByZone(zoneId);
  }

  @Get('cities/:cityId/woredas')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getWoredasByCityController(@Param('cityId') cityId: string): Promise<WoredaResponseDto[]> {
    return await this.locationUseCase.getWoredasByCity(cityId);
  }

  @Get('subcities/:subcityId/woredas')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getWoredasBySubcityController(@Param('subcityId') subcityId: string): Promise<WoredaResponseDto[]> {
    return await this.locationUseCase.getWoredasBySubcity(subcityId);
  }

  @Put('woredas/:id')
  @Roles(Role.SUPER_ADMIN)
  async updateWoredaController(
    @Param('id') id: string,
    @Body() updateWoredaDto: UpdateWoredaDto,
  ): Promise<WoredaResponseDto> {
    return await this.locationUseCase.updateWoreda(id, updateWoredaDto);
  }

  @Delete('woredas/:id/soft')
  @Roles(Role.SUPER_ADMIN)
  async softDeleteWoredaController(@Param('id') id: string): Promise<WoredaResponseDto> {
    return await this.locationUseCase.softDeleteWoreda(id);
  }

  @Delete('woredas/:id/hard')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDeleteWoredaController(@Param('id') id: string): Promise<void> {
    await this.locationUseCase.hardDeleteWoreda(id);
  }

  // ==================== Kebele Endpoints ====================

  @Post('kebeles')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createKebeleController(@Body() createKebeleDto: CreateKebeleDto): Promise<KebeleResponseDto> {
    return await this.locationUseCase.createKebele(createKebeleDto);
  }

  @Get('kebeles')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getAllKebelesController(): Promise<KebeleResponseDto[]> {
    return await this.locationUseCase.getAllKebeles();
  }

  @Get('kebeles/digital-seal')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL)
  async getKebelesWithDigitalSealController(): Promise<KebeleResponseDto[]> {
    return await this.locationUseCase.getKebelesWithDigitalSeal();
  }

  @Get('kebeles/:id')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getKebeleByIdController(@Param('id') id: string): Promise<KebeleResponseDto> {
    return await this.locationUseCase.getKebeleById(id);
  }

  @Get('regions/:regionId/kebeles')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getKebelesByRegionController(@Param('regionId') regionId: string): Promise<KebeleResponseDto[]> {
    return await this.locationUseCase.getKebelesByRegion(regionId);
  }

  @Get('zones/:zoneId/kebeles')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getKebelesByZoneController(@Param('zoneId') zoneId: string): Promise<KebeleResponseDto[]> {
    return await this.locationUseCase.getKebelesByZone(zoneId);
  }

  @Get('cities/:cityId/kebeles')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getKebelesByCityController(@Param('cityId') cityId: string): Promise<KebeleResponseDto[]> {
    return await this.locationUseCase.getKebelesByCity(cityId);
  }

  @Get('subcities/:subcityId/kebeles')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getKebelesBySubcityController(@Param('subcityId') subcityId: string): Promise<KebeleResponseDto[]> {
    return await this.locationUseCase.getKebelesBySubcity(subcityId);
  }

  @Get('woredas/:woredaId/kebeles')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getKebelesByWoredaController(@Param('woredaId') woredaId: string): Promise<KebeleResponseDto[]> {
    return await this.locationUseCase.getKebelesByWoreda(woredaId);
  }

  @Put('kebeles/:id')
  @Roles(Role.SUPER_ADMIN)
  async updateKebeleController(
    @Param('id') id: string,
    @Body() updateKebeleDto: UpdateKebeleDto,
  ): Promise<KebeleResponseDto> {
    return await this.locationUseCase.updateKebele(id, updateKebeleDto);
  }

  @Delete('kebeles/:id/soft')
  @Roles(Role.SUPER_ADMIN)
  async softDeleteKebeleController(@Param('id') id: string): Promise<KebeleResponseDto> {
    return await this.locationUseCase.softDeleteKebele(id);
  }

  @Delete('kebeles/:id/hard')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDeleteKebeleController(@Param('id') id: string): Promise<void> {
    await this.locationUseCase.hardDeleteKebele(id);
  }

  // ==================== Hierarchy Endpoints ====================

  @Get('hierarchy/kebele/:kebeleId')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL, Role.LANDLORD, Role.TENANT)
  async getFullLocationHierarchyController(@Param('kebeleId') kebeleId: string): Promise<{
    region: RegionResponseDto | null;
    zone: ZoneResponseDto | null;
    city: CityResponseDto | null;
    subcity: SubcityResponseDto | null;
    woreda: WoredaResponseDto | null;
    kebele: KebeleResponseDto | null;
  }> {
    return await this.locationUseCase.getFullLocationHierarchy(kebeleId);
  }

  @Get('hierarchy/region/:regionId')
  @Roles(Role.SUPER_ADMIN, Role.KEBELE_OFFICIAL)
  async getRegionHierarchyController(@Param('regionId') regionId: string): Promise<{
    region: RegionResponseDto | null;
    zones: ZoneResponseDto[];
    cities: CityResponseDto[];
    subcities: SubcityResponseDto[];
    woredas: WoredaResponseDto[];
    kebeles: KebeleResponseDto[];
  }> {
    return await this.locationUseCase.getRegionHierarchy(regionId);
  }
}