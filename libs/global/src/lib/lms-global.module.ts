import { Global, Module } from '@nestjs/common';
import { LibAPIResponseService } from './services';
import { PrismaClientModule } from '@lms-backend/prisma-client';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [PrismaClientModule],
  controllers: [],
  providers: [LibAPIResponseService, ConfigService],
  exports: [LibAPIResponseService],
})
export class LibGlobalModule { }
