import { ExtendedChain } from "../pages/SelectChainPage/types";

/**
  Verify if a chain is active, considering the "world" mode
  In "world" mode, only chain 480 can be active
  In normal mode, use the standard isActive logic
 */
export const isChainActiveForWorld = (
  chain: ExtendedChain | undefined,
  isWorld: boolean
): boolean => {
  if (!chain) return false;

  if (isWorld) {
    return chain.chainId === 480 && chain.isActive;
  }
  return chain.isActive;
};
