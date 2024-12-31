import { ExtendedChain, ProtocolContracts } from "../pages/SelectChainPage/types";
import { NativeTokenCatalog } from "./nativeTokenCatalog";

interface Chain {
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
    blockExplorers?: {
        default: { name: string; url: string };
    };
    testnet: boolean;
    protocolContracts: ProtocolContracts;
}

export function transformToChainConfig(chain: ExtendedChain, nativeToken: NativeTokenCatalog): Chain {
    return {
        id: chain.chain_id,
        name: chain.name,
        network: chain.key,
        nativeCurrency: {
            name: nativeToken.native_token.name,
            symbol: nativeToken.native_token.symbol,
            decimals: nativeToken.native_token.decimals,
        },
        rpcUrls: {
            default: { http: [chain.rpc_url] },
            public: { http: [chain.rpc_url] },
        },
        testnet: chain.is_testnet,
        protocolContracts: chain.protocol_contracts,
    };
}