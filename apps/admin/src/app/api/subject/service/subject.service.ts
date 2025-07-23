import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { SubjectRepository } from '@lms-backend/data-access';
import { Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class SubjectService {
  constructor(private subjectRepo: SubjectRepository) { }

  async create(createSubjectDto: CreateSubjectDto) {
    return await this.subjectRepo.create(createSubjectDto);
  }

  findAll() {
    return `This action returns all grade`;
  }

  findOne(id: string) {
    return this.subjectRepo.subject({ id: id });
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    return await this.subjectRepo.update({
      where: { id: id },
      data: updateSubjectDto,
    });
  }

  async softDelete(id: string,data:any) {
    const record = await this.subjectRepo.subject({
      id: id,
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }
    
    return await this.subjectRepo.softDelete({ id: id },data);
  }

  async findAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SubjectWhereInput;
    orderBy?: Prisma.SubjectOrderByWithAggregationInput;
  }) {
    const [items, total] = await Promise.all([
      this.subjectRepo.findMany(params),
      this.subjectRepo.count({ where: params.where }),
    ]);
    return [items, total];
  }
}
