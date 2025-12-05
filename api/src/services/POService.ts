import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IPORepository, PurchaseOrderWithItems } from '../repositories/PORepository';
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
  constructor(@inject(TYPES.PORepository) private poRepository: IPORepository) {}

  private mapToResponse(po: PurchaseOrderWithItems): POResponse {
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

    // Format date fields - Prisma returns Date objects
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    return {
      id: po.id,
      date: formatDate(po.date),
      clientName: po.clientName,
      osgPiNo: po.osgPiNo,
      osgPiDate: formatDate(po.osgPiDate),
      clientPoNo: po.clientPoNo,
      clientPoDate: formatDate(po.clientPoDate),
      poStatus: po.poStatus,
      noOfDispatch: po.noOfDispatch,
      clientAddress: po.clientAddress,
      clientContact: po.clientContact,
      poItems,
      dispatchPlanDate: formatDate(po.dispatchPlanDate),
      siteLocation: po.siteLocation,
      oscSupport: po.oscSupport,
      confirmDateOfDispatch: formatDate(po.confirmDateOfDispatch),
      paymentStatus: po.paymentStatus,
      remarks: po.remarks || null,
      createdAt: po.createdAt.toISOString(),
      updatedAt: po.updatedAt.toISOString(),
    };
  }

  async createPO(data: CreatePORequest): Promise<POResponse> {
    const po = await this.poRepository.create(data);
    return this.mapToResponse(po);
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
    const po = await this.poRepository.update(id, data);
    return po ? this.mapToResponse(po) : null;
  }

  async deletePO(id: string): Promise<boolean> {
    return this.poRepository.delete(id);
  }
}
