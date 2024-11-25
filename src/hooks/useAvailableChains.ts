import { useCallback } from 'react'
import { ChainType, ExtendedChain } from '../pages/SelectChainPage/types'

// Minimal type for GetChainById function to align with UI-only requirements
export type GetChainById = (
  chainId?: number,
  chains?: ExtendedChain[]
) => ExtendedChain | undefined

export const useAvailableChains = (chainTypes?: ChainType[]) => {
  // Empty data and minimal placeholders for UI rendering
  const data = [] // Empty array representing no available chains
  const isLoading = false // Placeholder for loading state

  // Empty getChainById function to satisfy the hook’s signature
  const getChainById: GetChainById = useCallback(
    (chainId?: number, chains: ExtendedChain[] | undefined = data) => {
      return undefined // Always returns undefined for a UI-only mock
    },
    [data]
  )

  return {
    chains: data,
    getChainById,
    isLoading,
  }
}
