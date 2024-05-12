import { Position } from '../entities/position.entity';
import { ResolverPositionExtra } from '../resolver-registry/resolver.entity';

/**
 * A data structure which efficiently stores the positions fetched for a given owner
 * on multiple chains denominated by their chain IDs, on various protocols.
 */
export type ListPositionsRO = Record<number, PositionsPerProtocol>;

/**
 * A data structure which efficiently stores the posititions fetched for a given owner
 * on various DeFi protocols.
 */
export type PositionsPerProtocol = {
  [K: string]: Position<ResolverPositionExtra>[];
};
