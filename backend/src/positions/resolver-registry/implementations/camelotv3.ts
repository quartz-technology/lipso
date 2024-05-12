import { Position } from 'src/positions/entities/position.entity';
import { Resolver } from '../resolver.entity';
import {
  Address,
  GetContractReturnType,
  PublicClient,
  getContract,
} from 'viem';
import {
  CAMELOT_V3_FACTORY_ABI,
  CAMELOT_V3_NONFUNGIBLE_POSITION_MANAGER_ABI,
  CAMELOT_V3_POOL_ABI,
} from './camelotv3.abi';
import { ProtocolName } from './constants';

export interface CamelotV3PositionExtra {}

export class CamelotV3Resolver extends Resolver {
  // The Camelot V3 factory contract.
  private FACTORY_CONTRACT: GetContractReturnType<
    typeof CAMELOT_V3_FACTORY_ABI,
    PublicClient
  >;

  // The Camelot V3 non-fungible position manager contract.
  private NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT: GetContractReturnType<
    typeof CAMELOT_V3_NONFUNGIBLE_POSITION_MANAGER_ABI,
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
      abi: CAMELOT_V3_FACTORY_ABI,
      client: client,
    });

    this.NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT = getContract({
      address: nonFungiblePositionsManagerAddress,
      abi: CAMELOT_V3_NONFUNGIBLE_POSITION_MANAGER_ABI,
      client: client,
    });
  }

  /**
   * Fetches all Camelot V3 positions for a specific owner.
   *
   * @param owner The owner of the positions to fetch.
   * @returns A list of Camelot V3 positions for the owner.
   */
  async findAllPositions<CamelotV3PositionExtra>(
    owner: Address,
  ): Promise<Position<CamelotV3PositionExtra>[]> {
    const ownerPositionCount =
      await this.NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT.read.balanceOf([
        owner,
      ]);

    const allCamelotV3Positions = await Promise.all(
      Array.from({ length: Number(ownerPositionCount) }).map(async (_, i) => {
        const positionID =
          await this.NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT.read.tokenOfOwnerByIndex(
            [owner, BigInt(i)],
          );

        const position =
          await this.NON_FUNGIBLE_POSITIONS_MANAGER_CONTRACT.read.positions([
            positionID,
          ]);

        return position;
      }),
    );

    const positions = await Promise.all(
      allCamelotV3Positions
        .filter((camelotV3Position) => {
          return camelotV3Position[6] !== 0n;
        })
        .map(async (camelotV3Position) => {
          const poolAddress = await this.FACTORY_CONTRACT.read.poolByPair([
            camelotV3Position[2],
            camelotV3Position[3],
          ]);

          const pool = getContract({
            address: poolAddress,
            abi: CAMELOT_V3_POOL_ABI,
            client: this.client,
          });

          const poolData = await pool.read.globalState();

          const tick = poolData[1];
          const positionTickLower = camelotV3Position[4];
          const positionTickUpper = camelotV3Position[5];

          return {
            inRange: tick >= positionTickLower && tick < positionTickUpper,
          } as Position<CamelotV3PositionExtra>;
        }),
    );

    return positions;
  }

  getProtocolName(): ProtocolName {
    return ProtocolName.CamelotV3;
  }
}
