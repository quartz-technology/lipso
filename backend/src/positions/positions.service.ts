import { Injectable } from '@nestjs/common';
import { ListPositionsDTO } from './dto/list-positions.dto';
import { Position } from './entities/position.entity';
import { ResolverRegistryService } from './resolver-registry/resolver-registry.service';
import { getAddress } from 'viem';
import { ResolverPositionExtra } from './resolver-registry/resolver.entity';

@Injectable()
export class PositionsService {
  async findAll(
    query: ListPositionsDTO,
    resolverRegistryService: ResolverRegistryService,
  ): Promise<Position<ResolverPositionExtra>[]> {
    const owner = getAddress(query.owner);
    const store = resolverRegistryService.getStore();

    const positions = (
      await Promise.all(
        Array.from(store.values()).map((resolver) => {
          return Promise.all(
            resolver.map((r) =>
              r.findAllPositions<ResolverPositionExtra>(owner),
            ),
          );
        }),
      )
    )
      .flat()
      .flat();

    return positions;
  }
}
