import { Test, TestingModule } from '@nestjs/testing';
import { RoleAttributeService } from './role-attribute.service';

describe('RoleAttributeService', () => {
  let service: RoleAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAttributeService],
    }).compile();

    service = module.get<RoleAttributeService>(RoleAttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
