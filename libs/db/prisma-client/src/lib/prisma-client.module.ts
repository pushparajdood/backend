import { Global, Module } from '@nestjs/common';
// import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // loads your .env
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
  // imports: [PrismaModule],
})
export class PrismaClientModule {}
