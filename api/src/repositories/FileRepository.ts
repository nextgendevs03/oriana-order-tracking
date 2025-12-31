import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { PrismaClient, FileUpload, Prisma } from '@prisma/client';

/**
 * File status enum
 */
export type FileStatus = 'pending' | 'confirmed' | 'deleted';

/**
 * Data for creating a new file upload record
 */
export interface CreateFileUploadData {
  originalFileName: string;
  storedFileName: string;
  mimeType: string;
  fileSize: number;
  s3Key: string;
  s3Bucket: string;
  status?: FileStatus;
  entityType?: string;
  entityId?: string;
  poId?: string;
  uploadedBy: number;
}

/**
 * Data for updating a file upload record
 */
export interface UpdateFileUploadData {
  status?: FileStatus;
  entityType?: string;
  entityId?: string;
  poId?: string;
  confirmedAt?: Date;
  deletedAt?: Date;
}

/**
 * Parameters for listing files
 */
export interface ListFilesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: FileStatus;
  entityType?: string;
  entityId?: string;
  poId?: string;
  uploadedBy?: number;
}

export interface IFileRepository {
  create(data: CreateFileUploadData): Promise<FileUpload>;
  createMany(data: CreateFileUploadData[]): Promise<FileUpload[]>;
  findById(fileId: number): Promise<FileUpload | null>;
  findByIds(fileIds: number[]): Promise<FileUpload[]>;
  findByEntity(entityType: string, entityId: string, status?: FileStatus): Promise<FileUpload[]>;
  findByPO(poId: string, params?: ListFilesParams): Promise<{ rows: FileUpload[]; count: number }>;
  findAll(params?: ListFilesParams): Promise<{ rows: FileUpload[]; count: number }>;
  findOrphanedPendingFiles(olderThanHours: number): Promise<FileUpload[]>;
  update(fileId: number, data: UpdateFileUploadData): Promise<FileUpload>;
  updateMany(fileIds: number[], data: UpdateFileUploadData): Promise<number>;
  softDelete(fileId: number): Promise<FileUpload>;
  hardDelete(fileId: number): Promise<void>;
  hardDeleteMany(fileIds: number[]): Promise<number>;
}

@injectable()
export class FileRepository implements IFileRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  /**
   * Create a new file upload record
   */
  async create(data: CreateFileUploadData): Promise<FileUpload> {
    return this.prisma.fileUpload.create({
      data: {
        originalFileName: data.originalFileName,
        storedFileName: data.storedFileName,
        mimeType: data.mimeType,
        fileSize: data.fileSize,
        s3Key: data.s3Key,
        s3Bucket: data.s3Bucket,
        status: data.status || 'pending',
        entityType: data.entityType,
        entityId: data.entityId,
        poId: data.poId,
        uploadedBy: data.uploadedBy,
      },
      include: {
        uploader: {
          select: {
            userId: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Create multiple file upload records in a transaction
   */
  async createMany(data: CreateFileUploadData[]): Promise<FileUpload[]> {
    const files = await this.prisma.$transaction(
      data.map((file) =>
        this.prisma.fileUpload.create({
          data: {
            originalFileName: file.originalFileName,
            storedFileName: file.storedFileName,
            mimeType: file.mimeType,
            fileSize: file.fileSize,
            s3Key: file.s3Key,
            s3Bucket: file.s3Bucket,
            status: file.status || 'pending',
            entityType: file.entityType,
            entityId: file.entityId,
            poId: file.poId,
            uploadedBy: file.uploadedBy,
          },
          include: {
            uploader: {
              select: {
                userId: true,
                username: true,
              },
            },
          },
        })
      )
    );
    return files;
  }

  /**
   * Find a file by its ID
   */
  async findById(fileId: number): Promise<FileUpload | null> {
    return this.prisma.fileUpload.findUnique({
      where: { fileId },
      include: {
        uploader: {
          select: {
            userId: true,
            username: true,
          },
        },
        purchaseOrder: {
          select: {
            poId: true,
          },
        },
      },
    });
  }

  /**
   * Find multiple files by their IDs
   */
  async findByIds(fileIds: number[]): Promise<FileUpload[]> {
    return this.prisma.fileUpload.findMany({
      where: {
        fileId: { in: fileIds },
      },
      include: {
        uploader: {
          select: {
            userId: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Find files by entity type and ID
   */
  async findByEntity(
    entityType: string,
    entityId: string,
    status?: FileStatus
  ): Promise<FileUpload[]> {
    const where: Prisma.FileUploadWhereInput = {
      entityType,
      entityId,
    };

    if (status) {
      where.status = status;
    } else {
      // By default, exclude deleted files
      where.status = { not: 'deleted' };
    }

    return this.prisma.fileUpload.findMany({
      where,
      include: {
        uploader: {
          select: {
            userId: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find files by PO ID with pagination
   */
  async findByPO(
    poId: string,
    params?: ListFilesParams
  ): Promise<{ rows: FileUpload[]; count: number }> {
    const { page = 1, limit = 20, sortOrder = 'DESC', status, entityType } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.FileUploadWhereInput = { poId };

    if (status) {
      where.status = status;
    } else {
      where.status = { not: 'deleted' };
    }

    if (entityType) {
      where.entityType = entityType;
    }

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.fileUpload.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder === 'ASC' ? 'asc' : 'desc' },
        include: {
          uploader: {
            select: {
              userId: true,
              username: true,
            },
          },
        },
      }),
      this.prisma.fileUpload.count({ where }),
    ]);

    return { rows, count };
  }

  /**
   * Find all files with pagination and filters
   */
  async findAll(params?: ListFilesParams): Promise<{ rows: FileUpload[]; count: number }> {
    const {
      page = 1,
      limit = 20,
      sortOrder = 'DESC',
      status,
      entityType,
      entityId,
      poId,
      uploadedBy,
    } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.FileUploadWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (entityType) {
      where.entityType = entityType;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    if (poId) {
      where.poId = poId;
    }

    if (uploadedBy) {
      where.uploadedBy = uploadedBy;
    }

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.fileUpload.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder === 'ASC' ? 'asc' : 'desc' },
        include: {
          uploader: {
            select: {
              userId: true,
              username: true,
            },
          },
        },
      }),
      this.prisma.fileUpload.count({ where }),
    ]);

    return { rows, count };
  }

  /**
   * Find orphaned pending files older than specified hours
   */
  async findOrphanedPendingFiles(olderThanHours: number): Promise<FileUpload[]> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - olderThanHours);

    return this.prisma.fileUpload.findMany({
      where: {
        status: 'pending',
        createdAt: { lt: cutoffDate },
      },
    });
  }

  /**
   * Update a file upload record
   */
  async update(fileId: number, data: UpdateFileUploadData): Promise<FileUpload> {
    return this.prisma.fileUpload.update({
      where: { fileId },
      data,
      include: {
        uploader: {
          select: {
            userId: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Update multiple file upload records
   */
  async updateMany(fileIds: number[], data: UpdateFileUploadData): Promise<number> {
    const result = await this.prisma.fileUpload.updateMany({
      where: { fileId: { in: fileIds } },
      data,
    });
    return result.count;
  }

  /**
   * Soft delete a file (mark as deleted)
   */
  async softDelete(fileId: number): Promise<FileUpload> {
    return this.prisma.fileUpload.update({
      where: { fileId },
      data: {
        status: 'deleted',
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Hard delete a file record from database
   */
  async hardDelete(fileId: number): Promise<void> {
    await this.prisma.fileUpload.delete({
      where: { fileId },
    });
  }

  /**
   * Hard delete multiple file records from database
   */
  async hardDeleteMany(fileIds: number[]): Promise<number> {
    const result = await this.prisma.fileUpload.deleteMany({
      where: { fileId: { in: fileIds } },
    });
    return result.count;
  }
}
