import { useQueryClient } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { Token, TokenAmount } from '../pages/SelectTokenPage/types';

export type TokensResponse = {
    tokens: { [chainId: number]: Token[] }
  }

export const useTokenSearch = (
  chainId?: number,
  tokenQuery?: string,
  enabled?: boolean
) => {
  const queryClient = useQueryClient();

  const { data, isPending } = useFetch<TokenAmount>({
    url: '/tokens/search', // Endpoint del backend para buscar tokens
    method: 'GET',
    queryParams: {
      chainId: chainId ?? '',
      tokenQuery: tokenQuery ?? '',
    },
    queryOptions: {
      enabled: Boolean(chainId && tokenQuery && enabled),
      retry: false,
      onSuccess: (token: Token) => {
        if (token) {
          queryClient.setQueriesData<TokensResponse>(
            { queryKey: ['tokens'] },
            (data) => {
              if (
                data &&
                !data.tokens[chainId as number]?.some(
                  (t) => t.address === token.address
                )
              ) {
                const clonedData = { ...data };
                clonedData.tokens[chainId as number]?.push(token);
                return clonedData;
              }
              return data;
            }
          );
        }
      },
    },
  });

  return {
    token: data,
    isPending,
  };
};
