import { Test, TestingModule } from '@nestjs/testing';
import { InteraccionesService } from './interacciones.service';

describe('InteraccionesService', () => {
  let service: InteraccionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteraccionesService],
    }).compile();

    service = module.get<InteraccionesService>(InteraccionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
