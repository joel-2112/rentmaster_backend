import { Injectable } from '@nestjs/common';
import { ContractEntity } from '../../domain/entities/contract.entity';
import { CreateContractDto } from '../dtos/create-contract.dto';
import { UpdateContractDto } from '../dtos/update-contract.dto';
import { ContractResponseDto } from '../dtos/contract-response.dto';

@Injectable()
export class ContractMapper {
  toContractEntityFromCreate(dto: CreateContractDto): Partial<ContractEntity> {
    return {
      propertyId: dto.propertyId,
      tenantId: dto.tenantId,
      landlordId: dto.landlordId,
      brokerId: dto.brokerId,
      monthlyRent: dto.monthlyRent,
      securityDeposit: dto.securityDeposit || 0,
      startDate: dto.startDate,
      endDate: dto.endDate,
      paymentDay: dto.paymentDay || 1,
      termsAndConditions: dto.termsAndConditions,
    };
  }

  toContractEntityFromUpdate(dto: UpdateContractDto): Partial<ContractEntity> {
    const entity: Partial<ContractEntity> = {};
    if (dto.monthlyRent !== undefined) entity.monthlyRent = dto.monthlyRent;
    if (dto.securityDeposit !== undefined) entity.securityDeposit = dto.securityDeposit;
    if (dto.startDate !== undefined) entity.startDate = dto.startDate;
    if (dto.endDate !== undefined) entity.endDate = dto.endDate;
    if (dto.paymentDay !== undefined) entity.paymentDay = dto.paymentDay;
    if (dto.termsAndConditions !== undefined) entity.termsAndConditions = dto.termsAndConditions;
    return entity;
  }

  toContractResponseDto(
    entity: ContractEntity,
    propertyTitle?: string,
    tenantName?: string,
    landlordName?: string,
    brokerName?: string
  ): ContractResponseDto {
    return {
      id: entity.id,
      contractNumber: entity.contractNumber,
      propertyId: entity.propertyId,
      propertyTitle,
      tenantId: entity.tenantId,
      tenantName,
      landlordId: entity.landlordId,
      landlordName,
      brokerId: entity.brokerId || undefined,
      brokerName,
      monthlyRent: entity.monthlyRent,
      securityDeposit: entity.securityDeposit,
      startDate: entity.startDate,
      endDate: entity.endDate,
      paymentDay: entity.paymentDay,
      termsAndConditions: entity.termsAndConditions || undefined,
      status: entity.status,
      landlordSigned: entity.landlordSigned,
      tenantSigned: entity.tenantSigned,
      brokerSigned: entity.brokerSigned,
      kebeleApproved: entity.kebeleApproved,
      kebeleApprovedBy: entity.kebeleApprovedBy || undefined,
      kebeleApprovedAt: entity.kebeleApprovedAt || undefined,
      kebeleStamp: entity.kebeleStamp || undefined,
      pdfUrl: entity.pdfUrl || undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toContractResponseDtoList(
    entities: ContractEntity[],
    propertyTitles?: Map<string, string>,
    tenantNames?: Map<string, string>,
    landlordNames?: Map<string, string>,
    brokerNames?: Map<string, string>
  ): ContractResponseDto[] {
    return entities.map(entity => this.toContractResponseDto(
      entity,
      propertyTitles?.get(entity.propertyId),
      tenantNames?.get(entity.tenantId),
      landlordNames?.get(entity.landlordId),
      entity.brokerId ? brokerNames?.get(entity.brokerId) : undefined
    ));
  }
}