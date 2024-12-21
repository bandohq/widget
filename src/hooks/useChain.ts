import { useMemo } from 'react'
import { useAvailableChains } from './useAvailableChains'

export const useChain = (chainId?: number) => {
  const { isPending : isLoading, getChainById } = useAvailableChains()

  const chain = useMemo(() => {
    return getChainById(chainId)
  }, [chainId, getChainById])

  return {
    chain,
    isLoading,
    getChainById,
  }
}
