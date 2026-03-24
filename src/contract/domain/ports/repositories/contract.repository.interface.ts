import { ContractEntity } from '../../entities/contract.entity';

export interface IContractRepository {
  // አዲስ ውል መፍጠር
  createContract(contract: Partial<ContractEntity>): Promise<ContractEntity>;

  // ውል በID ማግኘት
  getContractById(id: string): Promise<ContractEntity | null>;

  // ውል በቁጥር ማግኘት
  getContractByNumber(contractNumber: string): Promise<ContractEntity | null>;

  // በአከራይ የሚገኙ ውሎችን ማግኘት
  getContractsByLandlord(landlordId: string, skip?: number, take?: number): Promise<{ data: ContractEntity[]; total: number }>;

  // በተከራይ የሚገኙ ውሎችን ማግኘት
  getContractsByTenant(tenantId: string, skip?: number, take?: number): Promise<{ data: ContractEntity[]; total: number }>;

  // በቤት የሚገኙ ውሎችን ማግኘት
  getContractsByProperty(propertyId: string, skip?: number, take?: number): Promise<{ data: ContractEntity[]; total: number }>;

  // በሁኔታ የሚገኙ ውሎችን ማግኘት
  getContractsByStatus(status: string, skip?: number, take?: number): Promise<{ data: ContractEntity[]; total: number }>;

  // ውል ማዘመን
  updateContract(id: string, contract: Partial<ContractEntity>): Promise<ContractEntity>;

  // ውል መሰረዝ
  deleteContract(id: string): Promise<void>;

  // ውል መኖሩን ማረጋገጥ
  contractExists(id: string): Promise<boolean>;

  // ተከራይ እና አከራይ መካከል ንቁ ውል መኖሩን ማረጋገጥ
  hasActiveContract(propertyId: string, tenantId: string): Promise<boolean>;

  // የውል ቁጥር ማመንጨት
  generateContractNumber(): Promise<string>;
  getContractsByBroker(
    brokerId: string,
    skip?: number,
    take?: number
  ): Promise<{ data: ContractEntity[]; total: number }>;
}