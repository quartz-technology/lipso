import { Address, PublicClient } from 'viem';
import { Position } from '../entities/position.entity';
import { UniswapV3PositionExtra } from './implementations/uniswapv3';

/**
 * The extra data that a resolver can return for a position.
 *
 * As different protocols can return different data,
 * this type is a combination of all possible extra data that can be returned by any resolver.
 */
export type ResolverPositionExtra = UniswapV3PositionExtra;

/**
 * A resolver is a class that knows how to fetch positions for a specific owner from a protocol on a specific chain.
 */
export abstract class Resolver {
  constructor(public client: PublicClient) {
    this.client = client;
  }

  /**
   * Fetches all positions for a specific owner.
   * @param owner The owner of the positions to fetch.
   * @returns A list of positions for the owner.
   */
  abstract findAllPositions<ResolverPositionExtra>(
    owner: Address,
  ): Promise<Position<ResolverPositionExtra>[]>;
}
