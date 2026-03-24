import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IContractRepository } from '../../../domain/ports/repositories/contract.repository.interface';
import { ContractEntity } from '../../../domain/entities/contract.entity';
import { ContractStatus } from '../../../application/dtos/contract-status.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaContractRepository implements IContractRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toContractEntity(prismaContract: any): ContractEntity {
    return new ContractEntity({
      id: prismaContract.id,
      contractNumber: prismaContract.contractNumber,
      propertyId: prismaContract.propertyId,
      tenantId: prismaContract.tenantId,
      landlordId: prismaContract.landlordId,
      brokerId: prismaContract.brokerId,
      monthlyRent: prismaContract.monthlyRent,
      securityDeposit: prismaContract.securityDeposit,
      startDate: prismaContract.startDate,
      endDate: prismaContract.endDate,
      paymentDay: prismaContract.paymentDay,
      termsAndConditions: prismaContract.termsAndConditions,
      status: prismaContract.status,
      landlordSigned: prismaContract.landlordSigned,
      tenantSigned: prismaContract.tenantSigned,
      brokerSigned: prismaContract.brokerSigned,
      landlordSignedAt: prismaContract.landlordSignedAt,
      tenantSignedAt: prismaContract.tenantSignedAt,
      brokerSignedAt: prismaContract.brokerSignedAt,
      kebeleApproved: prismaContract.kebeleApproved,
      kebeleApprovedBy: prismaContract.kebeleApprovedBy,
      kebeleApprovedAt: prismaContract.kebeleApprovedAt,
      kebeleStamp: prismaContract.kebeleSeal,
      pdfUrl: prismaContract.pdfUrl,
      createdAt: prismaContract.createdAt,
      updatedAt: prismaContract.updatedAt,
    });
  }

  async generateContractNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastContract = await this.prisma.contract.findFirst({
      where: {
        contractNumber: {
          startsWith: `CT-${year}-`,
        },
      },
      orderBy: {
        contractNumber: 'desc',
      },
    });

    let sequence = 1;
    if (lastContract) {
      const lastNumber = lastContract.contractNumber.split('-')[2];
      sequence = parseInt(lastNumber) + 1;
    }

    return `CT-${year}-${sequence.toString().padStart(4, '0')}`;
  }

  async createContract(contract: Partial<ContractEntity>): Promise<ContractEntity> {
    const contractNumber = await this.generateContractNumber();

    const newContract = await this.prisma.contract.create({
      data: {
        contractNumber,
        propertyId: contract.propertyId!,
        tenantId: contract.tenantId!,
        landlordId: contract.landlordId!,
        brokerId: contract.brokerId,
        monthlyRent: contract.monthlyRent!,
        securityDeposit: contract.securityDeposit || 0,
        startDate: contract.startDate!,
        endDate: contract.endDate!,
        paymentDay: contract.paymentDay || 1,
        termsAndConditions: contract.termsAndConditions,
        status: ContractStatus.DRAFT,
        landlordSigned: false,
        tenantSigned: false,
        brokerSigned: false,
        kebeleApproved: false,
      },
      include: {
        property: true,
        tenant: true,
        landlord: true,
        broker: true,
      },
    });

    return this.toContractEntity(newContract);
  }

  async getContractById(id: string): Promise<ContractEntity | null> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        property: true,
        tenant: true,
        landlord: true,
        broker: true,
      },
    });

    return contract ? this.toContractEntity(contract) : null;
  }

  async getContractByNumber(contractNumber: string): Promise<ContractEntity | null> {
    const contract = await this.prisma.contract.findUnique({
      where: { contractNumber },
      include: {
        property: true,
        tenant: true,
        landlord: true,
        broker: true,
      },
    });

    return contract ? this.toContractEntity(contract) : null;
  }

  async getContractsByLandlord(
    landlordId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: ContractEntity[]; total: number }> {
    const [contracts, total] = await Promise.all([
      this.prisma.contract.findMany({
        where: { landlordId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          property: true,
          tenant: true,
          broker: true,
        },
      }),
      this.prisma.contract.count({ where: { landlordId } }),
    ]);

    return {
      data: contracts.map(c => this.toContractEntity(c)),
      total,
    };
  }

  async getContractsByTenant(
    tenantId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: ContractEntity[]; total: number }> {
    const [contracts, total] = await Promise.all([
      this.prisma.contract.findMany({
        where: { tenantId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          property: true,
          landlord: true,
          broker: true,
        },
      }),
      this.prisma.contract.count({ where: { tenantId } }),
    ]);

    return {
      data: contracts.map(c => this.toContractEntity(c)),
      total,
    };
  }

  async getContractsByProperty(
    propertyId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: ContractEntity[]; total: number }> {
    const [contracts, total] = await Promise.all([
      this.prisma.contract.findMany({
        where: { propertyId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          tenant: true,
          landlord: true,
          broker: true,
        },
      }),
      this.prisma.contract.count({ where: { propertyId } }),
    ]);

    return {
      data: contracts.map(c => this.toContractEntity(c)),
      total,
    };
  }

  async getContractsByStatus(
    status: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ data: ContractEntity[]; total: number }> {
    const [contracts, total] = await Promise.all([
      this.prisma.contract.findMany({
        where: { status: status as ContractStatus },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          property: true,
          tenant: true,
          landlord: true,
          broker: true,
        },
      }),
      this.prisma.contract.count({ where: { status: status as ContractStatus } }),
    ]);

    return {
      data: contracts.map(c => this.toContractEntity(c)),
      total,
    };
  }

  async updateContract(id: string, contract: Partial<ContractEntity>): Promise<ContractEntity> {
    const data: any = { ...contract };
    delete data.id;
    delete data.contractNumber;
    delete data.createdAt;

    const updatedContract = await this.prisma.contract.update({
      where: { id },
      data,
      include: {
        property: true,
        tenant: true,
        landlord: true,
        broker: true,
      },
    });

    return this.toContractEntity(updatedContract);
  }

  async deleteContract(id: string): Promise<void> {
    await this.prisma.contract.delete({
      where: { id },
    });
  }

  async contractExists(id: string): Promise<boolean> {
    const count = await this.prisma.contract.count({
      where: { id },
    });
    return count > 0;
  }

  async hasActiveContract(propertyId: string, tenantId: string): Promise<boolean> {
    const count = await this.prisma.contract.count({
      where: {
        propertyId,
        tenantId,
        status: {
          in: [ContractStatus.ACTIVE, ContractStatus.PENDING_KEBELE],
        },
      },
    });
    return count > 0;
  }
  async getContractsByBroker(
  brokerId: string,
  skip: number = 0,
  take: number = 10
): Promise<{ data: ContractEntity[]; total: number }> {
  const [contracts, total] = await Promise.all([
    this.prisma.contract.findMany({
      where: { brokerId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        property: true,
        tenant: true,
        landlord: true,
        broker: true,
      },
    }),
    this.prisma.contract.count({ where: { brokerId } }),
  ]);

  return {
    data: contracts.map(c => this.toContractEntity(c)),
    total,
  };
}
}