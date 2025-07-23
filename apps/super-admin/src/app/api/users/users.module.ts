import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import {  UsersRepository, UsersRoleRepository } from '@lms-backend/data-access';
import { ConfigService } from '@nestjs/config';
import { TokenMiddleware } from '@lms-backend/auth';

@Module({
  controllers: [UsersController],
  providers: [UsersService,ConfigService,UsersRoleRepository,UsersRepository],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes(UsersController);
  }
}