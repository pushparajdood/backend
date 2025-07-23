import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenDtoDto
} from '../../users/dto/create-user.dto';
import { CreateAuthDto, RegisterAuthDto } from '../dto/create-auth.dto';
import { AuthService } from '../service/auth.service';
import { Public } from '@lms-backend/libs';
import { TokenBlacklistService } from '@lms-backend/auth';

@ApiTags('Authentications')
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly tokenBlacklistService: TokenBlacklistService
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({ status: 201, description: 'Login successful' })
  async login(
    @Body() loginRequestDto: LoginRequestDto
  ): Promise<LoginResponseDto> {
    return await this.authService.login(loginRequestDto);
  }

  @ApiBody({ type: RefreshTokenDtoDto })
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDtoDto): Promise<string | null> {
    return await this.authService.refreshToken(body?.token);
  }

  @ApiBearerAuth()
  @Post('logout')
  async logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      this.tokenBlacklistService.addToken(token);
    }

    return { message: 'Logged out successfully.' };
  }
}
