import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { isItemAllowed } from '../utils/item.js'
import { useAvailableChains } from './useAvailableChains.js'
import { ChainType } from '../pages/SelectChainPage/types.js'

export const useChains = (type?: FormType, chainTypes?: ChainType[]) => {
  const { chains } = useWidgetConfig()
  const {
    chains: availableChains,
    isPending: isLoadingAvailableChains,
    getChainById,
  } = useAvailableChains()

  const filteredChains = useMemo(() => {
    const filteredChains = type
      ? availableChains?.filter(
          (chain) =>
            isItemAllowed(chain.id, chains) &&
            isItemAllowed(chain.id, chains?.[type]) &&
            // Check against chain types if they are provided
            (chainTypes?.includes(chain.chainType) ?? true)
        )
      : availableChains?.filter((chain) => isItemAllowed(chain.id, chains))
    return filteredChains
  }, [availableChains, chainTypes, chains, type])

  return {
    chains: filteredChains,
    getChainById,
    isLoading: isLoadingAvailableChains,
  }
}
