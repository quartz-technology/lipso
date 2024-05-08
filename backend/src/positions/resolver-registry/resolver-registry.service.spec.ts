import { Test, TestingModule } from '@nestjs/testing';
import { ResolverRegistryService } from './resolver-registry.service';

describe('ResolverRegistryService', () => {
  let service: ResolverRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResolverRegistryService],
    }).compile();

    service = module.get<ResolverRegistryService>(ResolverRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
