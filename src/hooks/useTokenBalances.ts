import { BANDO_API_URL_V2 } from '../config/constants';
import { ExtendedChain } from '../pages/SelectChainPage/types';
import { Token } from '../pages/SelectTokenPage/types';
import { useFetch } from './useFetch';

const defaultRefetchInterval = 30_000;

export const useTokenBalances = (
  accountAddress?: number,
  token?: Token,
  chain?: ExtendedChain
) => {
  // if (!accountAddress || !token) {
  //   throw new Error('Account address and token are required.');
  // }

  const queryParams = {
    account: accountAddress,
    tokenAddress: token.address,
    chainId: token.chainId,
  };

  const result = useFetch<Token[]>({
    url: `${BANDO_API_URL_V2}ramps/token/sol/?all=true&direction=OFF`,
    queryParams,
    method: 'GET',
    useFullUrl: false,
    queryOptions: {
        queryKey: ['token-balance', accountAddress, token?.chainId, token?.address], 
      refetchInterval: defaultRefetchInterval,
      staleTime: defaultRefetchInterval,
    },
  });

  return {
    ...result, // Spread all properties (data, isPending, error, etc.)
    refetchAllBalances: () => {
      // Trigger refetch manually by invalidating query
      result.refetch();
    },
    refetchNewBalance: () => {
      // Temporarily reduce refetch interval (if applicable)
    },
  };
};
