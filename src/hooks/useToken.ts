import { useMemo } from 'react'

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

// useTokens: replace with actual token fetching implementation
const useTokens = (chainId?: number) => ({
  tokens: chainId
    ? [
        {
          logoURI: '',
          symbol: 'MCK',
          decimals: 18,
          name: 'MockToken',
          chainId,
          address: '0xMockAddress',
        },
      ]
    : [],
  isLoading: false,
})

export const useToken = (chainId?: number, tokenAddress?: string) => {
  const { tokens, isLoading } = useTokens(chainId)

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
