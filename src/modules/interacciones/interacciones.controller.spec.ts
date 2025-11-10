import { Test, TestingModule } from '@nestjs/testing';
import { InteraccionesController } from './interacciones.controller';

describe('InteraccionesController', () => {
  let controller: InteraccionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteraccionesController],
    }).compile();

    controller = module.get<InteraccionesController>(InteraccionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
