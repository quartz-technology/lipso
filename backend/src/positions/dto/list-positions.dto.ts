import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ProtocolName } from '../resolver-registry/implementations/constants';

/**
 * Parameters for the `/positions` endpoint, used to specify:
 *
 * - The Ethereum Address of the owner of the positions.
 * - The list of networks to fetch positions from.
 * - The list of protocols to fetch positions from.
 */
export class ListPositionsDTO {
  @IsNotEmpty()
  @IsEthereumAddress()
  owner: string;

  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  chainIDs: number[];

  @IsArray()
  @IsEnum(ProtocolName, { each: true })
  protocols: ProtocolName[];
}
