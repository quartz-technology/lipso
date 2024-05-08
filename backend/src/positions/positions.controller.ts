import { Controller, Get, Query } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { ListPositionsDTO } from './dto/list-positions.dto';
import { Position } from './entities/position.entity';
import { ResolverRegistryService } from './resolver-registry/resolver-registry.service';
import { mainnet } from 'viem/chains';
import { createPublicClient, getAddress, http } from 'viem';
import { ResolverPositionExtra } from './resolver-registry/resolver.entity';

@Controller('positions')
export class PositionsController {
  constructor(
    private readonly positionsService: PositionsService,
    private resolverRegistryService: ResolverRegistryService,
  ) {
    // TODO: Get HTTP endpoint from config.
    const ethMainnetClient = createPublicClient({
      chain: mainnet,
      transport: http(undefined, {
        batch: {
          batchSize: 10,
        },
      }),
    });

    // TODO: Get UniswapV3 mainnet deployment addresses from config.
    this.resolverRegistryService.registerUniswapV3Resolver(
      ethMainnetClient,
      getAddress('0x1F98431c8aD98523631AE4a59f267346ea31F984'),
      getAddress('0xC36442b4a4522E871399CD717aBDD847Ab11FE88'),
    );
  }

  @Get()
  async findAll(
    @Query() query: ListPositionsDTO,
  ): Promise<Position<ResolverPositionExtra>[]> {
    return this.positionsService.findAll(query, this.resolverRegistryService);
  }
}
