import { useMemo } from 'react'
import { useTokens } from './useTokens'

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

export const useToken = (chainId?: number, tokenAddress?: string) => {
  const { tokens, isPending: isLoading } = useTokens(chainId)

  const token = useMemo(() => {
    const token = tokens?.find(
      (token) => token.address === tokenAddress && token.chainId === chainId
    )
    return token
  }, [chainId, tokenAddress, tokens])

  const tokenSearchEnabled = !isLoading && !token
  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(chainId, tokenAddress, tokenSearchEnabled)

  return {
    token: token ?? searchedToken,
    isLoading: isLoading || (tokenSearchEnabled && isSearchedTokenLoading),
  }
}
