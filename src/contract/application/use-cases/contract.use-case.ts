import { Injectable, NotFoundException, ConflictException, ForbiddenException, Inject } from '@nestjs/common';
import type { IContractRepository } from '../../domain/ports/repositories/contract.repository.interface';
import { ContractMapper } from '../mappers/contract.mapper';
import { ContractEntity } from '../../domain/entities/contract.entity';
import { ContractStatus } from '../dtos/contract-status.enum';

// DTOs
import { CreateContractDto } from '../dtos/create-contract.dto';
import { UpdateContractDto } from '../dtos/update-contract.dto';
import { ContractResponseDto } from '../dtos/contract-response.dto';

@Injectable()
export class ContractUseCase {
  constructor(
    @Inject('IContractRepository')
    private readonly contractRepository: IContractRepository,
    private readonly contractMapper: ContractMapper,
  ) {}

  // ==================== ዋና የውል ማስተዳደር ዘዴዎች ====================

/**
 * አዲስ የኪራይ ውል መፍጠር
 */
async createContract(
  createContractDto: CreateContractDto,
  userId: string,
  userRole: string
): Promise<ContractResponseDto> {
  // ፈቃድ ማረጋገጥ - TENANT ወይም LANDLORD ብቻ መፍጠር ይችላሉ
  if (!['TENANT', 'LANDLORD', 'BROKER', 'SUPER_ADMIN'].includes(userRole)) {
    throw new ForbiddenException('የኪራይ ውል ለመፍጠር ፈቃድ የለህም');
  }

  // ተከራይ እንደ ተጠቃሚ እየፈጠረ ከሆነ
  if (userRole === 'TENANT') {
    createContractDto.tenantId = userId;
  }

  // አከራይ እንደ ተጠቃሚ እየፈጠረ ከሆነ
  if (userRole === 'LANDLORD') {
    createContractDto.landlordId = userId;
  }

  // 👇 እነዚህን ማረጋገጫዎች ጨምር
  if (!createContractDto.tenantId || !createContractDto.landlordId) {
    throw new ForbiddenException('የተከራይ እና የአከራይ አይዲ ያስፈልጋል');
  }

  // ተከራይ እና አከራይ አንድ አይደሉም ማረጋገጥ
  if (createContractDto.tenantId === createContractDto.landlordId) {
    throw new ConflictException('አከራይ እና ተከራይ አንድ አይሆኑም');
  }

  // በዚህ ቤት እና ተከራይ መካከል ንቁ ውል መኖሩን አረጋግጥ
  const hasActiveContract = await this.contractRepository.hasActiveContract(
    createContractDto.propertyId,
    createContractDto.tenantId
  );

  if (hasActiveContract) {
    throw new ConflictException('በዚህ ቤት እና ተከራይ መካከል ንቁ ውል አለ');
  }

  const contractEntity = this.contractMapper.toContractEntityFromCreate(createContractDto);
  const newContract = await this.contractRepository.createContract(contractEntity);

  return this.getContractById(newContract.id);
}

  /**
   * ውል በID ማግኘት
   */
  async getContractById(id: string): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    // የተሳታፊዎች ስሞችን ለማግኘት (በኋላ ላይ ከUserModule እናመጣለን)
    const propertyTitle = await this.getPropertyTitle(contract.propertyId);
    const tenantName = await this.getUserName(contract.tenantId);
    const landlordName = await this.getUserName(contract.landlordId);
    const brokerName = contract.brokerId ? await this.getUserName(contract.brokerId) : undefined;

    return this.contractMapper.toContractResponseDto(
      contract,
      propertyTitle,
      tenantName,
      landlordName,
      brokerName
    );
  }

  /**
   * በተከራይ የሚገኙ ውሎችን ማግኘት
   */
  async getContractsByTenant(
    tenantId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.contractRepository.getContractsByTenant(tenantId, skip, limit);

    const enrichedContracts = await this.enrichContractsWithNames(data);

    return {
      data: enrichedContracts,
      total,
    };
  }

  /**
   * በአከራይ የሚገኙ ውሎችን ማግኘት
   */
  async getContractsByLandlord(
    landlordId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.contractRepository.getContractsByLandlord(landlordId, skip, limit);

    const enrichedContracts = await this.enrichContractsWithNames(data);

    return {
      data: enrichedContracts,
      total,
    };
  }

  /**
   * በቤት የሚገኙ ውሎችን ማግኘት
   */
  async getContractsByProperty(
    propertyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.contractRepository.getContractsByProperty(propertyId, skip, limit);

    const enrichedContracts = await this.enrichContractsWithNames(data);

    return {
      data: enrichedContracts,
      total,
    };
  }

  /**
   * በሁኔታ የሚገኙ ውሎችን ማግኘት
   */
  async getContractsByStatus(
    status: ContractStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ContractResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.contractRepository.getContractsByStatus(status, skip, limit);

    const enrichedContracts = await this.enrichContractsWithNames(data);

    return {
      data: enrichedContracts,
      total,
    };
  }

  /**
   * ውል ማዘመን
   */
  async updateContract(
    id: string,
    updateContractDto: UpdateContractDto,
    userId: string,
    userRole: string
  ): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    // ፈቃድ ማረጋገጥ - ውሉ ንቁ ካልሆነ ብቻ ማዘመን ይቻላል
    if (contract.status !== ContractStatus.DRAFT) {
      throw new ForbiddenException('ውሉ ከተፈረመ በኋላ ማዘመን አይቻልም');
    }

    // የተሳታፊዎች ብቻ ማዘመን ይችላሉ
    if (
      userRole !== 'SUPER_ADMIN' &&
      contract.tenantId !== userId &&
      contract.landlordId !== userId &&
      contract.brokerId !== userId
    ) {
      throw new ForbiddenException('ይህን ውል ለማዘመን ፈቃድ የለህም');
    }

    const contractEntity = this.contractMapper.toContractEntityFromUpdate(updateContractDto);
    const updatedContract = await this.contractRepository.updateContract(id, contractEntity);

    return this.getContractById(updatedContract.id);
  }

  /**
   * ውል መሰረዝ (ለሱፐር አድሚን ብቻ)
   */
  async deleteContract(id: string, userRole: string): Promise<void> {
    if (userRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('ውል ለመሰረዝ ሱፐር አድሚን መሆን አለብህ');
    }

    const contractExists = await this.contractRepository.contractExists(id);
    if (!contractExists) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    await this.contractRepository.deleteContract(id);
  }

  // ==================== የውል ፊርማ ዘዴዎች ====================

  /**
   * በአከራይ ፊርማ
   */
  async signByLandlord(id: string, userId: string): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    if (contract.landlordId !== userId) {
      throw new ForbiddenException('ይህን ውል ለመፈረም ፈቃድ የለህም');
    }

    if (contract.landlordSigned) {
      throw new ConflictException('ውሉ በአከራይ አስቀድሞ ተፈርሟል');
    }

    const updatedContract = await this.contractRepository.updateContract(id, {
      landlordSigned: true,
      landlordSignedAt: new Date(),
    } as any);

    // የውል ሁኔታ አዘምን
    await this.updateContractStatus(updatedContract);

    return this.getContractById(id);
  }

  /**
   * በተከራይ ፊርማ
   */
  async signByTenant(id: string, userId: string): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    if (contract.tenantId !== userId) {
      throw new ForbiddenException('ይህን ውል ለመፈረም ፈቃድ የለህም');
    }

    if (contract.tenantSigned) {
      throw new ConflictException('ውሉ በተከራይ አስቀድሞ ተፈርሟል');
    }

    const updatedContract = await this.contractRepository.updateContract(id, {
      tenantSigned: true,
      tenantSignedAt: new Date(),
    } as any);

    await this.updateContractStatus(updatedContract);

    return this.getContractById(id);
  }

  /**
   * በደላላ ፊርማ
   */
  async signByBroker(id: string, userId: string): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    if (contract.brokerId !== userId) {
      throw new ForbiddenException('ይህን ውል ለመፈረም ፈቃድ የለህም');
    }

    if (contract.brokerSigned) {
      throw new ConflictException('ውሉ በደላላ አስቀድሞ ተፈርሟል');
    }

    const updatedContract = await this.contractRepository.updateContract(id, {
      brokerSigned: true,
      brokerSignedAt: new Date(),
    } as any);

    await this.updateContractStatus(updatedContract);

    return this.getContractById(id);
  }
// ==================== በደላላ የሚገኙ ውሎች ====================

/**
 * በደላላ የሚገኙ ውሎችን ማግኘት
 */
async getContractsByBroker(
  brokerId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: ContractResponseDto[]; total: number }> {
  const skip = (page - 1) * limit;
  const { data, total } = await this.contractRepository.getContractsByBroker(brokerId, skip, limit);

  const enrichedContracts = await this.enrichContractsWithNames(data);

  return {
    data: enrichedContracts,
    total,
  };
}
  // ==================== የቀበሌ ማረጋገጫ ዘዴዎች ====================

  /**
   * ውል ማረጋገጥ (ለቀበሌ ባለስልጣን)
   */
  async approveContract(
    id: string,
    officialId: string,
    seal?: string,
    notes?: string
  ): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    if (contract.status !== ContractStatus.PENDING_KEBELE) {
      throw new ConflictException('ውሉ ለማረጋገጥ ዝግጁ አይደለም');
    }

    if (!contract.landlordSigned || !contract.tenantSigned) {
      throw new ConflictException('ውሉ በሁሉም ወገኖች አልተፈረመም');
    }

    if (contract.brokerId && !contract.brokerSigned) {
      throw new ConflictException('ውሉ በደላላ አልተፈረመም');
    }

    const updatedContract = await this.contractRepository.updateContract(id, {
      kebeleApproved: true,
      kebeleApprovedBy: officialId,
      kebeleApprovedAt: new Date(),
      kebeleStamp: seal,
      status: ContractStatus.ACTIVE,
    } as any);

    return this.getContractById(updatedContract.id);
  }

  /**
   * ውል አለመቀበል (ለቀበሌ ባለስልጣን)
   */
  async rejectContract(
    id: string,
    officialId: string,
    reason: string
  ): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    if (contract.status !== ContractStatus.PENDING_KEBELE) {
      throw new ConflictException('ውሉ ለማረጋገጥ ዝግጁ አይደለም');
    }

    const updatedContract = await this.contractRepository.updateContract(id, {
      status: ContractStatus.DISPUTED,
      kebeleNotes: reason,
    } as any);

    return this.getContractById(updatedContract.id);
  }

  // ==================== የውል ክትትል ዘዴዎች ====================

  /**
   * ውል ማጠናቀቅ (terminate)
   */
  async terminateContract(
    id: string,
    userId: string,
    userRole: string,
    reason?: string
  ): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    if (contract.status !== ContractStatus.ACTIVE) {
      throw new ConflictException('ንቁ ያልሆነ ውል ማጠናቀቅ አይቻልም');
    }

    // ፈቃድ ማረጋገጥ
    if (
      userRole !== 'SUPER_ADMIN' &&
      contract.tenantId !== userId &&
      contract.landlordId !== userId
    ) {
      throw new ForbiddenException('ይህን ውል ለማጠናቀቅ ፈቃድ የለህም');
    }

    const updatedContract = await this.contractRepository.updateContract(id, {
      status: ContractStatus.TERMINATED,
      terminatedAt: new Date(),
      terminationReason: reason,
      terminationBy: userId,
    } as any);

    return this.getContractById(updatedContract.id);
  }

  // ==================== የውል ማደስ ዘዴዎች ====================

  /**
   * ውል ማደስ (renew)
   */
  async renewContract(
    id: string,
    newEndDate: Date,
    userId: string,
    userRole: string
  ): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`የኪራይ ውል በID '${id}' አልተገኘም`);
    }

    if (contract.status !== ContractStatus.ACTIVE && contract.status !== ContractStatus.EXPIRED) {
      throw new ConflictException('ንቁ ያልሆነ ወይም ጊዜው ያላለፈ ውል ማደስ አይቻልም');
    }

    // ፈቃድ ማረጋገጥ
    if (
      userRole !== 'SUPER_ADMIN' &&
      contract.tenantId !== userId &&
      contract.landlordId !== userId
    ) {
      throw new ForbiddenException('ይህን ውል ለማደስ ፈቃድ የለህም');
    }

    const updatedContract = await this.contractRepository.updateContract(id, {
      endDate: newEndDate,
      status: ContractStatus.ACTIVE,
      renewalCount: contract.renewalCount + 1,
      lastRenewedAt: new Date(),
    } as any);

    return this.getContractById(updatedContract.id);
  }

  // ==================== ረዳት ዘዴዎች ====================

  /**
   * የውል ሁኔታ ማዘመን (በፊርማ ሁኔታ መሰረት)
   */
  private async updateContractStatus(contract: ContractEntity): Promise<void> {
    let newStatus = contract.status;

    if (!contract.landlordSigned && !contract.tenantSigned && !contract.brokerSigned) {
      newStatus = ContractStatus.DRAFT;
    } else if (!contract.landlordSigned && contract.tenantSigned) {
      newStatus = ContractStatus.PENDING_LANDLORD;
    } else if (contract.landlordSigned && !contract.tenantSigned) {
      newStatus = ContractStatus.PENDING_TENANT;
    } else if (contract.landlordSigned && contract.tenantSigned && !contract.brokerSigned && contract.brokerId) {
      newStatus = ContractStatus.PENDING_BROKER;
    } else if (contract.landlordSigned && contract.tenantSigned && (!contract.brokerId || contract.brokerSigned)) {
      newStatus = ContractStatus.PENDING_KEBELE;
    }

    if (newStatus !== contract.status) {
      await this.contractRepository.updateContract(contract.id, { status: newStatus } as any);
    }
  }

  /**
   * የቤት ርዕስ ማግኘት (በኋላ ላይ ከPropertyModule እናመጣለን)
   */
  private async getPropertyTitle(propertyId: string): Promise<string | undefined> {
    // ጊዜያዊ መፍትሄ - በኋላ ላይ ከPropertyModule እናመጣለን
    return undefined;
  }

  /**
   * የተጠቃሚ ስም ማግኘት (በኋላ ላይ ከUserModule እናመጣለን)
   */
  private async getUserName(userId: string): Promise<string | undefined> {
    // ጊዜያዊ መፍትሄ - በኋላ ላይ ከUserModule እናመጣለን
    return undefined;
  }

  /**
   * ውሎችን በስሞች ማበልጸግ
   */
  private async enrichContractsWithNames(
    contracts: ContractEntity[]
  ): Promise<ContractResponseDto[]> {
    const enriched: ContractResponseDto[] = [];

    for (const contract of contracts) {
      const propertyTitle = await this.getPropertyTitle(contract.propertyId);
      const tenantName = await this.getUserName(contract.tenantId);
      const landlordName = await this.getUserName(contract.landlordId);
      const brokerName = contract.brokerId ? await this.getUserName(contract.brokerId) : undefined;

      enriched.push(this.contractMapper.toContractResponseDto(
        contract,
        propertyTitle,
        tenantName,
        landlordName,
        brokerName
      ));
    }

    return enriched;
  }
}