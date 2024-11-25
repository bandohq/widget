import { useCallback } from 'react';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { useFetch } from './useFetch';
import { isItemAllowed } from '../utils/item.js';
import { ChainType, ExtendedChain } from '../pages/SelectChainPage/types.js';

export type GetChainById = (
  chainId?: number,
  chains?: ExtendedChain[]
) => ExtendedChain | undefined;

const supportedChainTypes = [ChainType.EVM, ChainType.SVM, ChainType.UTXO] 

export const useAvailableChains = (chainTypes?: ChainType[]) => {
  const { chains } = useWidgetConfig();

  const { data, isPending } = useFetch<ExtendedChain[]>({
    url: '/chains/available',
    method: 'GET',
    queryParams: {
      chainTypes: JSON.stringify(
        chainTypes ||
          supportedChainTypes.filter((chainType) =>
            isItemAllowed(chainType, chains?.types)
          )
      ),
    },
    queryOptions: {
      queryKey: ['available-chains'],
      refetchInterval: 300_000,
      staleTime: 300_000,
    },
  });

  const getChainById: GetChainById = useCallback(
    (chainId?: number, chains: ExtendedChain[] | undefined = data) => {
      if (!chainId) {
        return undefined;
      }
      const chain = chains?.find((chain) => chain.id === chainId);
      return chain;
    },
    [data]
  );

  return {
    chains: data,
    getChainById,
    isPending,
  };
};
