import { Position } from 'src/positions/entities/position.entity';
import { Resolver } from '../resolver.entity';
import {
  Address,
  GetContractReturnType,
  PublicClient,
  getContract,
} from 'viem';
import {
  UNISWAP_V3_FACTORY_ABI,
  UNISWAP_V3_NONFUNGIBLE_POSITION_MANAGER_ABI,
  UNISWAP_V3_POOL_ABI,
} from './uniswapv3.abi';
import { ProtocolName } from './constants';

/**
 * Extra data that the Uniswap V3 resolver can return for a position.
 * It contains the position ID, used to create a link to the position on the official Uniswap V3 interface.
 */
export interface UniswapV3PositionExtra {
  positionID: string;
}

/**
 * A resolver that knows how to fetch Uniswap V3 positions for a specific owner.
 */
export class UniswapV3Resolver extends Resolver {
  // The Uniswap V3 factory contract.
  private FACTORY_CONTRACT: GetContractReturnType<
    typeof UNISWAP_V3_FACTORY_ABI,
    PublicClient
  >;

  // The Uniswap V3 non-fungible position manager contract.
  private NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT: GetContractReturnType<
    typeof UNISWAP_V3_NONFUNGIBLE_POSITION_MANAGER_ABI,
    PublicClient
  >;

  constructor(
    client: PublicClient,
    factoryAddress: Address,
    nonFungiblePositionsManagerAddress: Address,
  ) {
    super(client);

    this.FACTORY_CONTRACT = getContract({
      address: factoryAddress,
      abi: UNISWAP_V3_FACTORY_ABI,
      client: client,
    });

    this.NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT = getContract({
      address: nonFungiblePositionsManagerAddress,
      abi: UNISWAP_V3_NONFUNGIBLE_POSITION_MANAGER_ABI,
      client: client,
    });
  }

  /**
   * Fetches all Uniswap V3 positions for a specific owner.
   *
   * @param owner The owner of the positions to fetch.
   * @returns A list of Uniswap V3 positions for the owner.
   */
  async findAllPositions<UniswapV3PositionExtra>(
    owner: Address,
  ): Promise<Position<UniswapV3PositionExtra>[]> {
    const ownerPositionCount =
      await this.NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT.read.balanceOf([
        owner,
      ]);

    const allUniswapV3Positions = await Promise.all(
      Array.from({ length: Number(ownerPositionCount) }).map(async (_, i) => {
        const positionID =
          await this.NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT.read.tokenOfOwnerByIndex(
            [owner, BigInt(i)],
          );

        const position =
          await this.NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT.read.positions([
            positionID,
          ]);

        return {
          positionID,
          position,
        };
      }),
    );

    const positions = await Promise.all(
      allUniswapV3Positions
        .filter((uniswapV3Position) => {
          return uniswapV3Position.position[7] !== 0n;
        })
        .map(async (uniswapV3Position) => {
          const poolAddress = await this.FACTORY_CONTRACT.read.getPool([
            uniswapV3Position.position[2],
            uniswapV3Position.position[3],
            uniswapV3Position.position[4],
          ]);

          const pool = getContract({
            address: poolAddress,
            abi: UNISWAP_V3_POOL_ABI,
            client: this.client,
          });

          const slot0 = await pool.read.slot0();

          return {
            inRange:
              slot0[1] >= uniswapV3Position.position[5] &&
              slot0[1] < uniswapV3Position.position[6],
            extra: {
              positionID: uniswapV3Position.positionID.toString(),
            },
          } as Position<UniswapV3PositionExtra>;
        }),
    );

    return positions;
  }

  getProtocolName(): ProtocolName {
    return ProtocolName.UniswapV3;
  }
}
