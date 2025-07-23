import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TenantService } from './service/tenant.service';
import { TenantController } from './controller/tenant.controller';
import { TenantRepository, UsersRepository, } from '@lms-backend/data-access';
import { TokenMiddleware } from '@lms-backend/auth';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [TenantController],
  providers: [TenantService, TenantRepository, ConfigService,UsersRepository],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes(TenantController);
  }
}
