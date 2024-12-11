import { useCallback } from 'react';
import { useFetch } from './useFetch';
import { ChainType, ExtendedChain } from '../pages/SelectChainPage/types.js';
import { BANDO_API_URL_V2 } from '../config/constants.js';

export type GetChainById = (
  chainId?: number,
  chains?: ExtendedChain[]
) => ExtendedChain | undefined;

interface AvailableChainsResponse {
  data: {
    data: ExtendedChain[];
  };
}

export const useAvailableChains = (chainTypes?: ChainType[]) => {

  const { data: response, isPending } = useFetch<AvailableChainsResponse[]>({
    url: `${BANDO_API_URL_V2}ramps/network/?direction=ON`,
    useFullUrl: false,
    method: 'GET',
    queryParams: {
    },
    queryOptions: {
      queryKey: ['available-chains'],
      refetchInterval: 300_000,
      staleTime: 300_000,
    },
  });

  const data = response?.data || [];

  const getChainById: GetChainById = useCallback(
    (chainId?: number, chains: ExtendedChain[] | undefined = data) => {
      if (!chainId) {
        return undefined;
      }

      const chain = chains?.find((chain) => chain.chain_id === chainId);
      return (chains.length > 0) && chain ? chain : chains[0];
    },
    [data]
  );

  return {
    chains: data,
    getChainById,
    isPending,
  };
};
