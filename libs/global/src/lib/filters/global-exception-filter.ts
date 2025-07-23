import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from 'nestjs-pino';

export interface HandleErrorReturn {
  statusCode: number;
  message: string;
  type: string;
}

@Catch()
export class StandardExceptionsFilter extends BaseExceptionFilter {
  private readonly logger: Logger;

  constructor(
    private readonly httpAdapter: AbstractHttpAdapter,
    logger: Logger
  ) {
    super(httpAdapter);
    this.logger = logger;
  }

  override catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    FormatError(exception, request, response);
  }
}

function FormatError(e: any, req: FastifyRequest, res: FastifyReply): void {
  const message = Array.isArray(e?.response?.message)
    ? e?.response?.message?.join?.(', ')
    : e.message;
  const payload = {
    success: false,
    message,
    error: {
      statusCode: 500,
      type: e.name ?? 'HttpException',
      timestamp: new Date().toISOString(),
      path: req.url,
    },
  };

  const formattedError = HandleNestError(e) || null;
  const finalStatusCode = formattedError?.statusCode || 500;

  if (!formattedError) {
    res.status(500).send(payload);
  }

  payload.message = formattedError?.message;
  payload.error.type = formattedError?.type;
  payload.error.statusCode = finalStatusCode;

  res.status(finalStatusCode).send(payload);
}

function HandleNestError(error: any): HandleErrorReturn | undefined {
  if (error instanceof ConflictException) {
    return {
      statusCode: 409,
      message: error.message,
      type: ConflictException.name,
    };
  }

  if (error instanceof BadRequestException) {
    let formattedMessage = 'Invalid Request';
    const errorResponse = error.getResponse() as { message: string | string[] };

    if (errorResponse && errorResponse.message) {
      if (Array.isArray(errorResponse.message)) {
        formattedMessage = errorResponse.message.join(', ');
      } else {
        formattedMessage = errorResponse.message;
      }
    }

    return {
      statusCode: 400,
      message: formattedMessage,
      type: BadRequestException.name,
    };
  }

  if (error instanceof NotFoundException) {
    return {
      statusCode: 404,
      message: error.message,
      type: NotFoundException.name,
    };
  }

  if (error instanceof ForbiddenException) {
    return {
      statusCode: 403,
      message: error.message,
      type: ForbiddenException.name,
    };
  }

  if (error instanceof UnauthorizedException) {
    return {
      statusCode: 401,
      message: error.message,
      type: UnauthorizedException.name,
    };
  }

  // Return undefined if the error is not handled
  return undefined;
}
