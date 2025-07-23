/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyReply, FastifyRequest } from 'fastify';
import qs from 'node:querystring';
import { HttpExceptionFilter, ResponseInterceptor } from '@lms-backend/libs';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    logger: false,
    querystringParser: (str) => qs.parse(str),
  });

  fastifyAdapter.get('/', (req: FastifyRequest, res: FastifyReply) => {
    res.code(200);
    res.send({
      message: 'Welcome to LMS',
    });
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
  );

  const logger = app.get<Logger>(Logger);
  const adapter = app.get<HttpAdapterHost>(HttpAdapterHost);
  const fastify = app.getHttpAdapter().getInstance();

  fastify.after(() => {
    fastify.addHook(
      'onRequest',
      (request, reply, done) => {
        // only protect swagger
        if (!request.raw.url.startsWith('/api/admin-docs')) {
          return done();
        }

        const SW_USER = process.env.SWAGGER_USER || 'admin';
        const SW_PASS = process.env.SWAGGER_PASS || 'password';
        const auth = request.headers.authorization;

        if (!auth || !auth.startsWith('Basic ')) {
          reply
            .header('WWW-Authenticate', 'Basic realm="Restricted"')
            .code(401)
            .send('Unauthorized');
          return;        // don’t call done() after sending
        }

        const [user, pass] = Buffer
          .from(auth.slice(6), 'base64')
          .toString()
          .split(':', 2);

        if (user !== SW_USER || pass !== SW_PASS) {
          reply
            .header('WWW-Authenticate', 'Basic realm="Restricted"')
            .code(401)
            .send('Unauthorized');
          return;
        }

        // authenticated!
        done();
      }
    );
  });

  app.useLogger(app.get(Logger));
  // See: https://github.com/nestjs/nest/issues/964#issuecomment-413563009
  //app.useGlobalInterceptors(new LoggerErrorInterceptor());
  // app.useGlobalFilters(
  //   new StandardExceptionsFilter(adapter.httpAdapter, logger)
  // );
  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new ResponseInterceptor()
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const globalPrefix = 'api/admin';
  app.setGlobalPrefix(globalPrefix);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // Swagger setup
  const options = new DocumentBuilder()
    .setTitle('LMS API for Admin')
    .setDescription('API documentation for LMS Admin')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/admin-docs', app, document);

  const port = process.env.PORT_ADMIN || 80;
  try {
    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

bootstrap();
