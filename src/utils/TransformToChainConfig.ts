import { ExtendedChain, ProtocolContracts } from "../pages/SelectChainPage/types";
import { NativeTokenCatalog } from "./nativeTokenCatalog";

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
    }
    blockExplorers?: {
        default: { name: string; url: string };
    };
    testnet: boolean;
    protocolContracts: ProtocolContracts;
}

export function transformToChainConfig(chain: ExtendedChain, nativeToken: NativeTokenCatalog): Chain {
    return {
        id: chain.chainId,
        name: chain.name,
        network: chain.key,
        nativeCurrency: {
            name: nativeToken.native_token.name,
            symbol: nativeToken.native_token.symbol,
            decimals: nativeToken.native_token.decimals,
        },
        rpcUrls: {
            default: { http: [chain.rpcUrl] },
            public: { http: [chain.rpcUrl] },
        },
        contracts: {
            multicall3: {
              address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            },
          },
        testnet: chain.isTestnet,
        protocolContracts: chain.protocolContracts,
    };
}