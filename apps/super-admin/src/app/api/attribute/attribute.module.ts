import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AttributeService } from './service/attribute.service';
import { AttributeController } from './controller/attribute.controller';
import { TokenMiddleware } from '@lms-backend/auth';
import { AttributeRepository } from '@lms-backend/data-access';

@Module({
  controllers: [AttributeController],
  providers: [AttributeService, AttributeRepository],
})
export class AttributeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes(AttributeController);
  }
}