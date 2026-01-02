import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import {
  IPORepository,
  PurchaseOrderWithRelations,
  POItemWithRelations,
} from '../repositories/PORepository';
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
  getPOById(poId: string): Promise<POResponse | null>;
  getAllPOs(params: ListPORequest): Promise<POListResponse>;
  updatePO(poId: string, data: UpdatePORequest): Promise<POResponse | null>;
  deletePO(poId: string): Promise<boolean>;
}

@injectable()
export class POService implements IPOService {
  constructor(@inject(TYPES.PORepository) private poRepository: IPORepository) {}

  private mapItemToResponse(item: POItemWithRelations): POItemResponse {
    return {
      id: item.id,
      categoryId: item.categoryId,
      categoryName: item.category?.categoryName,
      oemId: item.oemId,
      oemName: item.oem?.oemName,
      productId: item.productId,
      productName: item.product?.productName,
      quantity: item.quantity,
      spareQuantity: item.spareQuantity,
      totalQuantity: item.totalQuantity,
      pricePerUnit: Number(item.pricePerUnit),
      totalPrice: Number(item.totalPrice),
      gstPercent: Number(item.gstPercent),
      finalPrice: Number(item.finalPrice),
      warranty: item.warranty,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  private mapToResponse(po: PurchaseOrderWithRelations): POResponse {
    const poItems: POItemResponse[] = (po.poItems || []).map((item) =>
      this.mapItemToResponse(item)
    );

    // Format date fields - Prisma returns Date objects
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    return {
      poId: po.poId,
      poReceivedDate: formatDate(po.poReceivedDate),
      clientId: po.clientId,
      clientName: po.client?.clientName,
      osgPiNo: po.osgPiNo,
      osgPiDate: formatDate(po.osgPiDate),
      clientPoNo: po.clientPoNo,
      clientPoDate: formatDate(po.clientPoDate),
      poStatus: po.poStatus,
      noOfDispatch: po.noOfDispatch,
      assignDispatchTo: po.assignDispatchTo,
      assignedUserName: po.assignedUser?.username || null,
      clientAddress: po.clientAddress,
      clientContact: po.clientContact,
      clientGST: po.client?.clientGST || null,
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

  async getPOById(poId: string): Promise<POResponse | null> {
    const po = await this.poRepository.findById(poId);
    return po ? this.mapToResponse(po) : null;
  }

  async getAllPOs(params: ListPORequest): Promise<POListResponse> {
    const { page = 1, limit = 10 } = params;
    const { rows, count } = await this.poRepository.findAll(params);

    return {
      data: rows.map((po) => this.mapToResponse(po)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async updatePO(poId: string, data: UpdatePORequest): Promise<POResponse | null> {
    const po = await this.poRepository.update(poId, data);
    return po ? this.mapToResponse(po) : null;
  }

  async deletePO(poId: string): Promise<boolean> {
    return this.poRepository.delete(poId);
  }
}
