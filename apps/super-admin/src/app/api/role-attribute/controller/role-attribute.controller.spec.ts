import { Test, TestingModule } from '@nestjs/testing';
import { RoleAttributeController } from './role-attribute.controller';
import { RoleAttributeService } from '../service/role-attribute.service';

describe('RoleAttributeController', () => {
  let controller: RoleAttributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleAttributeController],
      providers: [RoleAttributeService],
    }).compile();

    controller = module.get<RoleAttributeController>(RoleAttributeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
