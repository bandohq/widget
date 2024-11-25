export enum TokenFilterType {
  My = 0,
  All = 1,
}

export interface Token {
  name: string;
  symbol: string;       // Token symbol (e.g., ETH)
  decimals: number;
  address: string;      // Contract address on EVM chains, empty if not applicable
  chainId: number;      // Chain ID where the token is deployed
  logoURI?: string;     // Optional URI for the token logo
}