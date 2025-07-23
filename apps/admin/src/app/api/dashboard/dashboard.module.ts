import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { TokenMiddleware } from '@lms-backend/auth';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})

export class DashboardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes(DashboardController);
  }
}