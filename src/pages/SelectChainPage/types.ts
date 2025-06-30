import type { FormTypeProps } from '../../stores/form/types.js'
import { Token } from '../SelectTokenPage/types.js';

export interface SelectChainPageProps extends FormTypeProps {
  selectNativeToken?: boolean
}

export interface ChainKey {
  key: string;
}

export enum ChainType {
  EVM = 'EVM',
  // Solana virtual machine
  SVM = 'SVM',
  // Unspent transaction output (e.g. Bitcoin)
  UTXO = 'UTXO',
}

export interface _Chain {
  key: any
  chainType: ChainType
  name: string
  coin: any
  chain_id: number
  chainId: number
  id: number
  mainnet: boolean
  logoUrl: string
}

export interface BaseToken {
  chainId: any
  address: string
}

export interface StaticToken extends BaseToken {
  symbol: string
  decimals: number
  name: string
  coinKey?: any
  logoURI?: string
}

export interface EVMChain extends _Chain {
  // tokenlistUrl is DEPRECATED - will be removed in the next breaking release
  tokenlistUrl?: string
  metamask: any
  multicallAddress?: string
}

export interface CoinKey {
  symbol: string; // Symbol of the native currency (e.g., ETH, BTC)
  name: string;
}

export interface Chain {
  key: string;          
  networkType: ChainType; // Type of the chain (EVM, SVM, UTXO)
  name: string;
  coin: CoinKey;        // Information about the native currency
  id: number;           // Unique ID for the chain
  chainId: number;
  mainnet: boolean;
  rpcUrl: string;
  logoUrl?: string;
  isTestnet: boolean;
  isActive: boolean;
  protocolContracts?: ProtocolContracts;
}

export interface ChainWithNativeToken extends Chain {
  nativeToken: Token;
}

export interface ChainWithSpecialContracts extends Chain {
  diamondAddress: string; // Address of the Diamond Proxy contract
  permit2?: string;       // Address of the Permit2 contract (optional)
  permit2Proxy?: string;  // Address of the Proxy contract for Permit2 (optional)
}

export interface ExtendedChain extends ChainWithNativeToken, ChainWithSpecialContracts {}

export interface ProtocolContracts {
  BandoRouter?: Address;
  BandoFulfillable?: Address;
  BandoRouterProxy?: Address;
  ERC20TokenRegistry?: Address;
  FulfillableRegistry?: Address;
  BandoERC20Fulfillable?: Address;
  BandoFulfillableProxy?: Address;
  BandoFulfillmentManager?: Address;
  ERC20TokenRegistryProxy?: Address;
  FulfillableRegistryProxy?: Address;
  BandoERC20FulfillableProxy?: Address;
  BandoFulfillmentManagerProxy?: Address;
}

export type Address = `0x${string}`;

