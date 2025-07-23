import { Test, TestingModule } from '@nestjs/testing';
import { AttributeController } from './attribute.controller';
import { AttributeService } from '../service/attribute.service';

describe('AttributeController', () => {
  let controller: AttributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributeController],
      providers: [AttributeService],
    }).compile();

    controller = module.get<AttributeController>(AttributeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
