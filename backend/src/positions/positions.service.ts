import { Injectable } from '@nestjs/common';
import { ListPositionsDTO } from './dto/list-positions.dto';
import { ResolverRegistryService } from './resolver-registry/resolver-registry.service';
import { getAddress } from 'viem';
import {
  Resolver,
  ResolverPositionExtra,
} from './resolver-registry/resolver.entity';
import { ListPositionsRO, PositionsPerProtocol } from './ro/list-positions.ro';

@Injectable()
export class PositionsService {
  async findAll(
    query: ListPositionsDTO,
    resolverRegistryService: ResolverRegistryService,
  ): Promise<ListPositionsRO> {
    const owner = getAddress(query.owner);

    // Quick and dirty filtering of resolvers based on the query.
    const store = new Map<number, Resolver[]>(
      [...resolverRegistryService.getStore()]
        .filter(
          ([chainID, resolvers]) =>
            query.chainIDs.includes(chainID) &&
            resolvers.some((resolver) =>
              query.protocols.includes(resolver.getProtocolName()),
            ),
        )
        .map(([chain, resolvers]) => [
          chain,
          resolvers.filter((resolver) =>
            query.protocols.includes(resolver.getProtocolName()),
          ),
        ]),
    );

    const res: ListPositionsRO = {};

    await Promise.all(
      [...store.entries()].map(async ([chainID, resolvers]) => {
        const positions: PositionsPerProtocol = {};

        await Promise.all(
          resolvers.map(async (resolver) => {
            const resolverPositions =
              await resolver.findAllPositions<ResolverPositionExtra>(owner);
            positions[resolver.getProtocolName()] = resolverPositions;
          }),
        );

        res[chainID] = positions;
      }),
    );

    return res;
  }
}
