import { createConfig, http } from "@wagmi/core";
import { transformToChainConfig } from "./TransformToChainConfig";
import nativeTokenCatalog from "./nativeTokenCatalog";
import { ExtendedChain } from "../pages/SelectChainPage/types";

// Create a dynamic Wagmi configuration for the given chain
export const createDynamicConfig = (chain: ExtendedChain) => {
  if (!chain?.rpc_url) throw new Error("RPC URL is required for the chain");

  const nativeToken = nativeTokenCatalog.find(
    (item) => item.key === chain?.key
  );

  const configChain = transformToChainConfig(chain, nativeToken);
  const transports = http(chain.rpc_url);

  return createConfig({
    chains: [configChain],
    transports: {
      [chain.chain_id]: transports,
    },
  });
};
