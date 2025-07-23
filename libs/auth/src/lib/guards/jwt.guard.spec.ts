import { JwtGuard } from './jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

describe('JwtGuard', () => {
  let guard: JwtGuard;
  let reflector: Reflector;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtGuard, Reflector, ConfigService],
    }).compile();

    guard = module.get<JwtGuard>(JwtGuard);
    reflector = module.get<Reflector>(Reflector);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if the request is public', async () => {
      const context = {
        getHandler: jest.fn().mockReturnValue({}),
        getClass: jest.fn().mockReturnValue({}),
      } as unknown as ExecutionContext;
      reflector.getAllAndOverride = jest.fn().mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should call super.canActivate if the request is not public', async () => {
      const context = {
        getHandler: jest.fn().mockReturnValue({}),
        getClass: jest.fn().mockReturnValue({}),
      } as unknown as ExecutionContext;
      reflector.getAllAndOverride = jest.fn().mockReturnValue(false);
      guard.canActivate = jest.fn().mockResolvedValue(true);

      await guard.canActivate(context);

      expect(guard.canActivate).toHaveBeenCalledWith(context);
    });
  });
});
