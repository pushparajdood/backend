import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { LibAuthModule, JwtGuard } from '@lms-backend/auth';
import { PrismaClientModule } from '@lms-backend/prisma-client';
import * as Joi from 'joi';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { LibDataAccessModule, LibGlobalModule } from '@lms-backend/libs';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './api/tenant/tenant.module';
import { RoleModule } from './api/role/role.module';
import { AttributeModule } from './api/attribute/attribute.module';
import { RoleAttributeModule } from './api/role-attribute/role-attribute.module';
import { DashboardModule } from './api/dashboard/dashboard.module';

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
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT_SUPERADMIN: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
    }),
    TenantModule,
    RoleModule,
    AttributeModule,
    RoleAttributeModule,
    DashboardModule,
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
