import { useCallback } from 'react'

export enum ChainType {
    EVM = 'EVM',
    // Solana virtual machine
    SVM = 'SVM',
    // Unspent transaction output (e.g. Bitcoin)
    UTXO = 'UTXO',
  }
  
  export interface _Chain {
    key: any
    chainType: ChainType
    name: string
    coin: any
    id: number
    mainnet: boolean
    logoURI?: string
    // faucetUrls is DEPRECATED - will be removed in the next breaking release
    faucetUrls?: string[]
  }

  export interface BaseToken {
    chainId: any
    address: string
  }

  export interface StaticToken extends BaseToken {
    symbol: string
    decimals: number
    name: string
    coinKey?: any
    logoURI?: string
  }

  interface Token extends StaticToken {
    priceUSD: string
  }

export interface EVMChain extends _Chain {
    // tokenlistUrl is DEPRECATED - will be removed in the next breaking release
    tokenlistUrl?: string
    metamask: any
    multicallAddress?: string
  }

export type Chain = EVMChain

interface ExtendedChain extends Chain {
    nativeToken: Token
    diamondAddress: string
    permit2?: string
    permit2Proxy?: string
  }

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
