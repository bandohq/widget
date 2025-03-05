import { useMemo } from 'react'
import { useTokens } from './useTokens'
import { Chain } from '../pages/SelectChainPage/types'

// useTokenSearch: replace with actual search implementation for tokens
const useTokenSearch = (chainId?: number, tokenAddress?: string, enabled?: boolean) => ({
  token: enabled
    ? {
        logoURI: '',
        symbol: 'MCK',
        decimals: 18,
        name: 'MockToken',
        chainId: chainId ?? 1,
        address: tokenAddress ?? '0xMockAddress',
      }
    : undefined,
  isLoading: false,
})

export const useToken = (chain?: Chain, tokenAddress?: string) => {
  const { data: tokens, isPending: isLoading } = useTokens(chain)

  const token = useMemo(() => {
    const token = tokens?.find(
      (token) => token.address === tokenAddress
    )
    return token ?? null
  }, [chain?.chainId, tokenAddress, tokens])

  const tokenSearchEnabled = !isLoading && !token
  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(chain?.chainId, tokenAddress, tokenSearchEnabled)

  return {
    token,
    isLoading: isLoading || (tokenSearchEnabled && isSearchedTokenLoading),
  }
}
