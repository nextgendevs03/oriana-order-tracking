import { injectable, inject } from 'inversify';
import { Sequelize } from 'sequelize';
import { TYPES } from '../types/types';
import { IPORepository } from '../repositories/PORepository';
import { PurchaseOrder } from '../models';
import {
  CreatePORequest,
  UpdatePORequest,
  ListPORequest,
  POResponse,
  POListResponse,
  POItemResponse,
} from '../schemas';

export interface IPOService {
  createPO(data: CreatePORequest): Promise<POResponse>;
  getPOById(id: string): Promise<POResponse | null>;
  getAllPOs(params: ListPORequest): Promise<POListResponse>;
  updatePO(id: string, data: UpdatePORequest): Promise<POResponse | null>;
  deletePO(id: string): Promise<boolean>;
}

@injectable()
export class POService implements IPOService {
  constructor(
    @inject(TYPES.PORepository) private poRepository: IPORepository,
    @inject(TYPES.Sequelize) private sequelize: Sequelize
  ) {}

  private mapToResponse(po: PurchaseOrder): POResponse {
    const poItems: POItemResponse[] = (po.poItems || []).map((item) => ({
      id: item.id,
      category: item.category,
      oemName: item.oemName,
      product: item.product,
      quantity: item.quantity,
      spareQuantity: item.spareQuantity,
      totalQuantity: item.totalQuantity,
      pricePerUnit: Number(item.pricePerUnit),
      totalPrice: Number(item.totalPrice),
      warranty: item.warranty,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return {
      id: po.id,
      date: po.date,
      clientName: po.clientName,
      osgPiNo: po.osgPiNo,
      osgPiDate: po.osgPiDate,
      clientPoNo: po.clientPoNo,
      clientPoDate: po.clientPoDate,
      poStatus: po.poStatus,
      noOfDispatch: po.noOfDispatch,
      clientAddress: po.clientAddress,
      clientContact: po.clientContact,
      poItems,
      dispatchPlanDate: po.dispatchPlanDate,
      siteLocation: po.siteLocation,
      oscSupport: po.oscSupport,
      confirmDateOfDispatch: po.confirmDateOfDispatch,
      paymentStatus: po.paymentStatus,
      remarks: po.remarks || null,
      createdAt: po.createdAt.toISOString(),
      updatedAt: po.updatedAt.toISOString(),
    };
  }

  async createPO(data: CreatePORequest): Promise<POResponse> {
    const transaction = await this.sequelize.transaction();

    try {
      const po = await this.poRepository.create(data, transaction);
      await transaction.commit();
      return this.mapToResponse(po);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getPOById(id: string): Promise<POResponse | null> {
    const po = await this.poRepository.findById(id);
    return po ? this.mapToResponse(po) : null;
  }

  async getAllPOs(params: ListPORequest): Promise<POListResponse> {
    const { page = 1, limit = 10 } = params;
    const { rows, count } = await this.poRepository.findAll(params);

    return {
      items: rows.map((po) => this.mapToResponse(po)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async updatePO(id: string, data: UpdatePORequest): Promise<POResponse | null> {
    const transaction = await this.sequelize.transaction();

    try {
      const po = await this.poRepository.update(id, data, transaction);
      if (!po) {
        await transaction.rollback();
        return null;
      }
      await transaction.commit();
      return this.mapToResponse(po);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deletePO(id: string): Promise<boolean> {
    const transaction = await this.sequelize.transaction();

    try {
      const deleted = await this.poRepository.delete(id, transaction);
      await transaction.commit();
      return deleted;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
