import { createConfig, http } from "@wagmi/core";
import { transformToChainConfig } from "./TransformToChainConfig";
import { ExtendedChain } from "../pages/SelectChainPage/types";

// Create a dynamic Wagmi configuration for the given chain
export const createDynamicConfig = (chain: ExtendedChain) => {
  if (!chain?.rpcUrl) throw new Error("RPC URL is required for the chain");
  if (!chain?.nativeToken)
    throw new Error("Native token information is required for the chain");

  const configChain = transformToChainConfig(chain, chain.nativeToken);
  const transports = http(chain.rpcUrl);

  return createConfig({
    chains: [configChain],
    transports: {
      [chain.chainId]: transports,
    },
  });
};
