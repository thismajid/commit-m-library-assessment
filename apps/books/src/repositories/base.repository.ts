import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BaseRepository<T> {
  protected readonly entityName: string;

  constructor(protected readonly prisma: PrismaService) {
    this.entityName = this.getEntityName();
  }

  private getEntityName(): string {
    return this.constructor.name.replace('Repository', '').toLowerCase();
  }

  async create(data: any): Promise<T> {
    return this.prisma[this.entityName].create({ data });
  }

  async findAll(): Promise<T[]> {
    return this.prisma[this.entityName].findMany();
  }

  async findOne(id: number): Promise<T | null> {
    return this.prisma[this.entityName].findUnique({ where: { id } });
  }

  async update(id: number, data: any): Promise<T> {
    return this.prisma[this.entityName].update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<T> {
    return this.prisma[this.entityName].delete({ where: { id } });
  }
}
