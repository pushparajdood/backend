import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { UsersRepository } from '@lms-backend/data-access';
import { ConfigService } from '@nestjs/config';
import { LoginRequestDto, LoginResponseDto } from '../../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@lms-backend/libs';

@Injectable()
export class AuthService {
  private readonly jwtExpiration: number;
  private readonly jwtSecret: string;
  constructor(
    private readonly configService: ConfigService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {
    this.jwtExpiration =
      this.configService.getOrThrow<number>('JWT_EXPIRATION');
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
  }

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const userData = await this.usersRepository.findOne({
      email: loginRequestDto.email,
      userRoles: {
        some: {
          Role: {
            name: {
              in: [Role.ADMIN, Role.ORG_ADMIN]
            }
          }
        } 
      }
    });

    if (!userData) {
      throw new NotFoundException('User not found');
    }


    const roles = await this.usersRepository.findUserRole(userData?.user_id);

    if (!roles?.userRoles?.length) {
      throw new NotFoundException("Roles doesn't assign to current user!");
    }

    const roleNames = roles?.userRoles[0].Role?.name;

    const tokenPayload = {
      email: loginRequestDto.email,
      roles: roleNames,
      user_id: userData?.user_id,
    };

    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: this.jwtExpiration,
      secret: this.jwtSecret,
    });

    delete userData.password;
    const lastLogindata = {
      lastLoginAt: new Date(),
      updated_by: userData.user_id,
      updated_at: new Date()
    }

    this.usersRepository.updateUser({
      where: { user_id: userData.user_id },
      data: lastLogindata
    });

    return {
      user_id: userData.user_id,
      email: userData.email,
      access_token: token,
      role: roleNames,
      user: userData
    };
  }

  async refreshToken(oldRefreshToken: string): Promise<string | null> {
    try {
      const decoded = this.jwtService.decode(oldRefreshToken);

      if (!decoded?.exp) {
        throw new Error('Invalid requested token');
      }

      let refreshedToken = oldRefreshToken;

      const timeNow = Math.floor(Date.now() / 1000);
      const isTokenExpired = decoded.exp < timeNow;

      if (isTokenExpired) {
        const user = await this.usersRepository.findOne({
          email: decoded?.email,
        });

        if (!user) throw new Error('Invalid user');

        const roles = await this.usersRepository.findUserRole(user?.user_id);

        if (!roles?.userRoles?.length) {
          throw new NotFoundException("Roles doesn't assign to current user!");
        }

        const roleNames = roles?.userRoles[0].Role?.name;

        const tokenPayload = {
          email: user.email,
          roles: roleNames,
          user_id: user?.user_id,
        };

        refreshedToken = this.jwtService.sign(tokenPayload, {
          expiresIn: this.jwtExpiration,
          secret: this.jwtSecret,
        });
      }

      return refreshedToken;
    } catch (e) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
