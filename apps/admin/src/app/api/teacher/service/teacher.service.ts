import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { TeacherRepository, UsersRepository } from '@lms-backend/data-access';
import { Prisma, PrismaService } from '@lms-backend/prisma-client';
import * as bcrypt from 'bcrypt';
import { Role} from '@lms-backend/libs';

@Injectable()
export class TeacherService {
  constructor(
    private teacherRepo: TeacherRepository,
    private readonly userRepo: UsersRepository, 
    private prisma: PrismaService
  ) { }

  async create(createTeacherDto: any) {
    const existingUser = await this.userRepo.findFirst({
      where: {
        OR: [
          { email: createTeacherDto.email },
          { phone: createTeacherDto.phone }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === createTeacherDto.email) {
        throw new ConflictException('Email address already exists');
      }
      if (existingUser.phone === createTeacherDto.phone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    if (!createTeacherDto.password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(createTeacherDto.password, 10);
    return this.prisma.$transaction(async (tx) => {

      const user = await tx.user.create({
        data: {
          email: createTeacherDto.email,
          password: hashedPassword,
          firstName: createTeacherDto.firstName,
          lastName: createTeacherDto.lastName,
          phone: createTeacherDto.phone,
          tenantId: createTeacherDto.tenant_id,
          created_by: createTeacherDto.created_by
        }
      });

      const roleRecord = await tx.role.findUnique({ where: { name: Role.TEACHER } })

      const userRole = await tx.userRole.create({
        data: {
          user_id: user.user_id,
          role_id: roleRecord.role_id
        }
      });

      const teacher = await tx.teacher.create({
        data: {
          user_id: user.user_id,
          created_by: createTeacherDto.created_by
        }
      });

      const teacherSubject = await tx.teacherSubject.create({
        data: {
          teacherId: teacher.id,
          subjectId: createTeacherDto.subject_id,
          created_by: createTeacherDto.created_by
        }
      });
      
      return { teacher, user, userRole,teacherSubject };
    });
  }

  findAll() {
    return `This action returns all grade`;
  }

  findOne(id: string) {
    return this.teacherRepo.teacher({ id: id });
  }

  async update(id: string, updateTeacherDto: any) {
    return this.prisma.$transaction(async tx => {
      const user = await tx.user.update({
        where: { user_id: updateTeacherDto.user_id },
        data: {
          firstName: updateTeacherDto.firstName,
          lastName: updateTeacherDto.lastName,
          updated_at: updateTeacherDto.updated_at,
          updated_by: updateTeacherDto.updated_by
        },
      });

      const teacherSubject = await tx.teacherSubject.update({
        where: { id: id },
        data: {
          subjectId: updateTeacherDto.subject_id,
          updated_at: updateTeacherDto.updated_at,
          updated_by: updateTeacherDto.updated_by
        }
      });

      return { user,teacherSubject};
    });
  }

  async softDelete(id: string,data:any) {
    const record = await this.teacherRepo.teacher({
      id: id,
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }
    
    return await this.teacherRepo.softDelete({ id: id },data);
  }

  async findAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TeacherWhereInput;
    orderBy?: Prisma.TeacherOrderByWithAggregationInput;
  }) {
    const [items, total] = await Promise.all([
      this.teacherRepo.findMany(params),
      this.teacherRepo.count({ where: params.where }),
    ]);
    return [items, total];
  }
}
