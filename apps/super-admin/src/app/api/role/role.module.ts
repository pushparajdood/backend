import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RoleService } from './service/role.service';
import { RoleController } from './controller/role.controller';
import { TokenMiddleware } from '@lms-backend/auth';
import { RoleRepository } from '@lms-backend/data-access';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
})
export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes(RoleController);
  }
}
