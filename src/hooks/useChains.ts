import { useAvailableChains } from './useAvailableChains.js'


export const useChains = () => {
  // TODO: implement chains filters if necessary

  const {
    chains: availableChains,
    isPending: isLoadingAvailableChains,
    getChainById,
  } = useAvailableChains()

  return {
    chains: availableChains,
    getChainById,
    isLoading: isLoadingAvailableChains,
  }
}
