import {
  ExtendedChain,
  ProtocolContracts,
} from "../pages/SelectChainPage/types";

export interface Chain {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  contracts: {
    multicall3: {
      address: `0x${string}`;
      blockCreated?: number;
    };
  };
  blockExplorers?: {
    default: { name: string; url: string };
  };
  testnet: boolean;
  protocolContracts: ProtocolContracts;
}

export function transformToChainConfig(
  chain: ExtendedChain,
  nativeToken: any
): Chain {
  return {
    id: chain.chainId,
    name: chain.name,
    network: chain.key,
    nativeCurrency: {
      name: nativeToken.name,
      symbol: nativeToken.symbol,
      decimals: nativeToken.decimals,
    },
    rpcUrls: {
      default: { http: [chain.rpcUrl] },
      public: { http: [chain.rpcUrl] },
    },
    contracts: {
      multicall3: {
        address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      },
    },
    testnet: chain.isTestnet,
    protocolContracts: chain.protocolContracts,
  };
}
