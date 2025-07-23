import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGradeDto } from '../dto/create-grade.dto';
import { UpdateGradeDto } from '../dto/update-grade.dto';
import { GradeRepository } from '@lms-backend/data-access';
import { Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class GradeService {
  constructor(private gradeRepo: GradeRepository) { }
  async create(createGradeDto: CreateGradeDto) {
    return await this.gradeRepo.create(createGradeDto);
  }

  findAll() {
    return `This action returns all grade`;
  }

  findOne(id: string) {
    return this.gradeRepo.grade({ id: id });
  }

  async update(id: string, updateGradeDto: UpdateGradeDto) {
    return await this.gradeRepo.update({
      where: { id: id },
      data: updateGradeDto,
    });
  }

  async softDelete(id: string,data:any) {
    const record = await this.gradeRepo.grade({
      id: id,
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }
    
    return await this.gradeRepo.softDelete({ id: id },data);
  }

  async findAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.GradeWhereInput;
    orderBy?: Prisma.GradeOrderByWithAggregationInput;
  }) {
    const [items, total] = await Promise.all([
      this.gradeRepo.findMany(params),
      this.gradeRepo.count({ where: params.where }),
    ]);
    return [items, total];
  }
}
