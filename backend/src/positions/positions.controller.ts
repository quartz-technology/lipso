import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { ListPositionsDTO } from './dto/list-positions.dto';
import { ResolverRegistryService } from './resolver-registry/resolver-registry.service';
import { arbitrum, mainnet } from 'viem/chains';
import { createPublicClient, getAddress, http } from 'viem';
import { ListPositionsRO } from './ro/list-positions.ro';

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

    // TODO: Get HTTP endpoint from config.
    const arbitrumMainnetClient = createPublicClient({
      chain: arbitrum,
      transport: http(undefined, {
        batch: {
          batchSize: 10,
        },
      }),
    });

    // TODO: Get UniswapV3 ethereum mainnet deployment addresses from config.
    this.resolverRegistryService.registerUniswapV3Resolver(
      ethMainnetClient,
      getAddress('0x1F98431c8aD98523631AE4a59f267346ea31F984'),
      getAddress('0xC36442b4a4522E871399CD717aBDD847Ab11FE88'),
    );

    // TODO: Get CamelotV3 arbitrum mainnet deployment addresses from config.
    this.resolverRegistryService.registerCamelotV3Resolver(
      arbitrumMainnetClient,
      getAddress('0x1a3c9B1d2F0529D97f2afC5136Cc23e58f1FD35B'),
      getAddress('0x00c7f3082833e796A5b3e4Bd59f6642FF44DCD15'),
    );
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async findAll(@Query() query: ListPositionsDTO): Promise<ListPositionsRO> {
    return this.positionsService.findAll(query, this.resolverRegistryService);
  }
}
