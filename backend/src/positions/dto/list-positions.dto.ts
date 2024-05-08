import { IsNotEmpty } from 'class-validator';

/**
 * Parameters for the `/positions` endpoint, used to specify:
 *
 * - The Ethereum Address of the owner of the positions.
 */
export class ListPositionsDTO {
  // TODO: Validate that the owner is a valid Ethereum Address.
  @IsNotEmpty()
  owner: string;

  // TODO: Add a field to specify the list of chains.
  // TODO: Add a field to specify the list of protocols.
}
