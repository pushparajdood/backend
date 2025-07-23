import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseDto } from '../dtos/response.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const type = exception.name || 'InternalServerErrorException';
    let message =
      typeof exception.getResponse() === 'object'
        ? (exception.getResponse() as any).message || exception.message
        : exception.message;

    const description = message;

    if (exception instanceof PrismaClientKnownRequestError) {
      message = 'Database operation failed. Please check your input.';
    }

    const error = {
      type,
      description,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response
      .status(status)
      .send(new ResponseDto(status, false, message, null, error));
  }
}
