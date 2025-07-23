import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientModule } from '@lms-backend/prisma-client';
import { TokenBlacklistService } from './token-blacklist.service';
import { LibDataAccessModule } from 'libs/data-access/src/lib/data-access.module';

@Global()
@Module({
  imports: [LibDataAccessModule, PrismaClientModule],
  controllers: [],
  providers: [JwtService, TokenBlacklistService],
  exports: [TokenBlacklistService],
})
export class LibAuthModule { }
