import { TokenAmount } from "../../pages/SelectTokenPage/types"


export const filteredTokensComparator = (searchFilter: string) => {
  const isExactMatch = (token: TokenAmount) => {
    return (
      token.name?.toUpperCase() === searchFilter ||
      token.symbol.toUpperCase() === searchFilter ||
      token.address.toUpperCase() === searchFilter
    )
  }
  return (tokenA: TokenAmount, tokenB: TokenAmount) => {
    const isExactMatchA = isExactMatch(tokenA)
    const isExactMatchB = isExactMatch(tokenB)

    // Exact match with logo
    if (isExactMatchB && tokenB.imageUrl) {
      return 1
    }
    if (isExactMatchA && tokenA.imageUrl) {
      return -1
    }

    // Any token with a logo (exact match or not)
    if (tokenB.imageUrl && !tokenA.imageUrl) {
      return 1
    }
    if (tokenA.imageUrl && !tokenB.imageUrl) {
      return -1
    }

    // Exact match without logo
    if (isExactMatchB && !tokenB.imageUrl) {
      return 1
    }
    if (isExactMatchA && !tokenA.imageUrl) {
      return -1
    }

    // All other tokens are considered equal in sorting priority
    return 0
  }
}
