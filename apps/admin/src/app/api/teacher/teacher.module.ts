import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TeacherService } from './service/teacher.service';
import { TeacherController } from './controller/teacher.controller';
import { TokenMiddleware } from '@lms-backend/auth';
import { TeacherRepository } from '@lms-backend/data-access';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService,TeacherRepository],
})
export class TeacherModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes(TeacherController);
  }
}

