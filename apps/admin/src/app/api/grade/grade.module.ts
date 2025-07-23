import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GradeService } from './service/grade.service';
import { GradeController } from './controller/grade.controller';
import { GradeRepository } from '@lms-backend/data-access';
import { TokenMiddleware } from '@lms-backend/auth';

@Module({
  controllers: [GradeController],
  providers: [GradeService,GradeRepository],
})
export class GradeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes(GradeController);
  }
}

