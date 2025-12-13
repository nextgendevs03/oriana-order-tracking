import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IOEMRepository } from '../repositories/OEMRepository';
import { CreateOEMRequest, UpdateOEMRequest } from '../schemas/request/OEMRequest';
import { OEMResponse } from '../schemas/response/OEMResponse';

export interface IOEMService {
  createOEM(data: CreateOEMRequest): Promise<OEMResponse>;
  getAllOEMs(): Promise<OEMResponse[]>;
  getOEMById(id: string): Promise<OEMResponse | null>;
  updateOEM(id: string, data: UpdateOEMRequest): Promise<OEMResponse>;
  deleteOEM(id: string): Promise<void>;
}

@injectable()
export class OEMService implements IOEMService {
  constructor(@inject(TYPES.OEMRepository) private repo: IOEMRepository) {}

  async createOEM(data: CreateOEMRequest): Promise<OEMResponse> {
    const created = await this.repo.create(data);
    return created as unknown as OEMResponse;
  }

  async getAllOEMs(): Promise<OEMResponse[]> {
    const rows = await this.repo.findAll();
    return rows as unknown as OEMResponse[];
  }

  async getOEMById(id: string): Promise<OEMResponse | null> {
    const o = await this.repo.findById(id);
    return o as unknown as OEMResponse | null;
  }

  async updateOEM(id: string, data: UpdateOEMRequest): Promise<OEMResponse> {
    const updated = await this.repo.update(id, data);
    return updated as unknown as OEMResponse;
  }

  async deleteOEM(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
