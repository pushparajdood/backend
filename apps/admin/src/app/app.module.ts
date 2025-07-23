import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { LibAuthModule, JwtGuard } from '@lms-backend/auth';
import { PrismaClientModule } from '@lms-backend/prisma-client';
import * as Joi from 'joi';
import { LibDataAccessModule, LibGlobalModule } from '@lms-backend/libs';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './api/dashboard/dashboard.module';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { SubjectModule } from './api/subject/subject.module';
import { GradeModule } from './api/grade/grade.module';
import { TeacherModule } from './api/teacher/teacher.module';
import { AssignmentModule } from './api/assignment/assignment.module';
import { TenantModule } from './api/tenant/tenant.module';

@Module({
  imports: [
    PrismaClientModule,
    LibDataAccessModule,
    LibGlobalModule,
    LibAuthModule,
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: () => randomUUID(),
        autoLogging: false,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT_SUPERADMIN: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
    }),
    DashboardModule,
    AuthModule,
    UsersModule,
    SubjectModule,
    GradeModule,
    TeacherModule,
    AssignmentModule,
    TenantModule,
  ],
  // controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
