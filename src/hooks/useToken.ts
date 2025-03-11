import { useMemo } from 'react'
import { useTokens } from './useTokens'
import { Chain } from '../pages/SelectChainPage/types'



export const useToken = (chain?: Chain, tokenAddress?: string) => {
  const { data: tokens, isPending: isLoading } = useTokens(chain);

  const token = useMemo(() => {
    const token = tokens?.find((token) => token.address === tokenAddress);
    return token ?? null;
  }, [chain?.chainId, tokenAddress, tokens]);

  const tokenSearchEnabled = !isLoading && !token;

  const searchToken = (tokenAddress: string) => {
    if (!isLoading && !tokenAddress) return null;
    const token = tokens?.find((token) => token.address === tokenAddress);
    return token ?? null;
  };

  return {
    token,
    isLoading: isLoading,
    searchToken,
  };
};
