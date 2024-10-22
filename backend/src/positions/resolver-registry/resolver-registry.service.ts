import { Injectable } from '@nestjs/common';
import { Chain, PublicClient, Address } from 'viem';
import { Resolver } from './resolver.entity';
import { UniswapV3Resolver } from './implementations/uniswapv3';
import { CamelotV3Resolver } from './implementations/camelotv3';

/**
 * A service that keeps track of all resolvers for all chains.
 */
@Injectable()
export class ResolverRegistryService {
  // A mappping of chain to resolvers.
  private store: Map<number, Resolver[]>;

  constructor() {
    this.store = new Map();
  }

  /**
   * Registers a Uniswap V3 resolver for a given chain.
   *
   * @param client JSON-RPC client for a given chain.
   * @param factoryAddress Deployment address of the Uniswap V3 factory contract.
   * @param nonFungiblePositionManagerAddress Deployment address of the Uniswap V3 non-fungible position manager contract.
   */
  registerUniswapV3Resolver(
    client: PublicClient,
    factoryAddress: Address,
    nonFungiblePositionManagerAddress: Address,
  ) {
    this.registerResolver(
      client.chain!,
      new UniswapV3Resolver(
        client,
        factoryAddress,
        nonFungiblePositionManagerAddress,
      ),
    );
  }

  /**
   * Registers a Camelot V3 resolver for a given chain.
   *
   * @param client JSON-RPC client for a given chain.
   * @param factoryAddress Deployment address of the Camelot V3 factory contract.
   * @param nonFungiblePositionManagerAddress Deployment address of the Camelot V3 non-fungible position manager contract.
   */
  registerCamelotV3Resolver(
    client: PublicClient,
    factoryAddress: Address,
    nonFungiblePositionManagerAddress: Address,
  ) {
    this.registerResolver(
      client.chain!,
      new CamelotV3Resolver(
        client,
        factoryAddress,
        nonFungiblePositionManagerAddress,
      ),
    );
  }

  /**
   * Registers a resolver for a given chain.
   *
   * @param chain The chain to register the resolver for.
   * @param resolver The resolver used to fetch positions for a specific owner.
   */
  private registerResolver(chain: Chain, resolver: Resolver) {
    const chainResolvers = this.store.get(chain.id);

    if (!chainResolvers) {
      this.store.set(chain.id, [resolver]);
    } else {
      chainResolvers.push(resolver);
    }
  }

  /**
   * Returns all resolvers for all chains.
   *
   * @returns A map of chain to resolvers.
   */
  getStore(): Map<number, Resolver[]> {
    return this.store;
  }
}
