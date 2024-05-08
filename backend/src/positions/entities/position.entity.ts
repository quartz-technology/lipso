/**
 * A liquidity position on a DEX.
 *
 * As the goal of this project is to provide insights to the user about their liquidity positions, this entity helps to understand if their position is in range or not.
 * Depending on the DEX, the extra field can be used to store additional information about the position.
 * For example, in UniswapV3, the extra field stores the position ID can be used to create a link to the position on the official UniswapV3 interface.
 */
export class Position<T> {
  inRange: boolean;
  extra: T;
}
