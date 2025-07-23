import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RoleAttributeService } from './service/role-attribute.service';
import { RoleAttributeController } from './controller/role-attribute.controller';
import { TokenMiddleware } from '@lms-backend/auth';
import { AttributeRepository } from '@lms-backend/data-access';

@Module({
  controllers: [RoleAttributeController],
  providers: [RoleAttributeService, AttributeRepository],
})

export class RoleAttributeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes(RoleAttributeController);
  }
}
