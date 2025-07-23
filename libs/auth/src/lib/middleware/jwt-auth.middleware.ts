import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '@lms-backend/data-access';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  private readonly jwtSecret: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository
  ) {
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers.authorization;
    try {
      if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, this.jwtSecret, async (err, decoded) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              next(new UnauthorizedException('JWT token expired'));
            } else {
              next(new UnauthorizedException());
            }
          } else {
            if (!decoded) {
              return next(new UnauthorizedException('Token decoding failed'));
            }

            const email = (decoded as any).email;
            if (!email) {
              return next(
                new UnauthorizedException('Token does not contain username')
              );
            }
            const userDetails = await this.usersRepository.findOne({
              email: email,
            });
            if (!userDetails) {
              return next(new UnauthorizedException('User not found'));
            }
            req.user = userDetails;
            next();
          }
        });
      } else {
        next(new UnauthorizedException());
      }
    } catch (error) {
      next(new UnauthorizedException());
    }
  }
}
