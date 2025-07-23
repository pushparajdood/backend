import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SubjectService } from './service/subject.service';
import { SubjectController } from './controller/subject.controller';
import { SubjectRepository } from '@lms-backend/data-access';
import { TokenMiddleware } from '@lms-backend/auth';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService,SubjectRepository],
})
export class SubjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes(SubjectController);
  }
}
