import { bandoExplorerUrl } from '../config/constants.js'
import { useAvailableChains } from '../hooks/useAvailableChains.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'

const sanitiseBaseUrl = (baseUrl: string) => baseUrl.trim().replace(/\/+$/, '')

export type Chain = {
  chain_id: number
  metamask: {
    blockExplorerUrls: string[]
  }
}

export type TransactionLinkProps = { chain?: Chain | number } & (
  | {
      txHash: string
      txLink?: never
    }
  | {
      txHash?: never
      txLink: string
    }
)

export const useExplorer = () => {
  const { explorerUrls } = useWidgetConfig()
  const { getChainById } = useAvailableChains()

  const getBaseUrl = (chain: Chain) => {
    const baseUrl = explorerUrls?.[chain.chain_id]
      ? explorerUrls[chain.chain_id][0]
      : chain.metamask.blockExplorerUrls[0]

    return sanitiseBaseUrl(baseUrl)
  }

  const resolveChain = (chain: Chain | number) =>
    typeof chain === 'number' ? getChainById(chain) : chain

  const getTransactionLink = ({
    txHash,
    txLink,
    chain,
  }: TransactionLinkProps) => {
    if (!txHash && txLink) {
      return txLink
    }
    if (!chain) {
      const baseUrl = explorerUrls?.internal?.[0]
        ? sanitiseBaseUrl(explorerUrls.internal[0])
        : bandoExplorerUrl
      return `${baseUrl}/tx/${txHash}`
    }
    const resolvedChain = resolveChain(chain)
    return `${resolvedChain ? getBaseUrl(resolvedChain) : bandoExplorerUrl}/tx/${txHash}`
  }

  const getAddressLink = (address: string, chain?: Chain | number) => {
    if (!chain) {
      const baseUrl = explorerUrls?.internal?.[0]
        ? sanitiseBaseUrl(explorerUrls.internal[0])
        : bandoExplorerUrl
      return `${baseUrl}/address/${address}`
    }

    const resolvedChain = resolveChain(chain)
    return `${resolvedChain ? getBaseUrl(resolvedChain) : bandoExplorerUrl}/address/${address}`
  }

  return {
    getTransactionLink,
    getAddressLink,
  }
}
