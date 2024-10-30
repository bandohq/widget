// Mock types replacing SDK-based types
export type EVMChain = {
    id: number
    name: string
  }
  
  export type Process = {
    status?: ProcessStatus
    substatus?: Substatus
    error?: { code?: LiFiErrorCode; message?: string }
    txHash?: string
    type?: ProcessType
  }
  
  export type LiFiStep = {
    action: {
      fromAmount: string
      fromToken: { symbol: string; decimals: number }
      fromChainId: number
    }
    execution?: {
      status?: string
      process?: Process[]
    }
  }
  
  export type ProcessStatus = 'PENDING' | 'DONE' | 'FAILED' | 'ACTION_REQUIRED'
  export type ProcessType = 'TOKEN_ALLOWANCE' | 'SWAP' | 'CROSS_CHAIN' | 'RECEIVING_CHAIN'
  export type StatusMessage = 'PENDING' | 'DONE' | 'FAILED' | 'INVALID' | 'NOT_FOUND'
  export type Substatus = 'PARTIAL' | 'REFUNDED'
  
  export enum LiFiErrorCode {
    AllowanceRequired,
    BalanceError,
    ChainSwitchError,
    GasLimitError,
    InsufficientFunds,
    SlippageError,
    TransactionFailed,
    TransactionExpired,
    TransactionSimulationFailed,
    WalletChangedDuringExecution,
    TransactionUnderpriced,
    TransactionUnprepared,
    TransactionCanceled,
    TransactionConflict,
    ExchangeRateUpdateCanceled,
    SignatureRejected,
  }
  
  import { TFunction } from 'i18next'
  import { useTranslation } from 'react-i18next'
  
  // useWidgetConfig: replace with actual widget configuration hook
  const useWidgetConfig = () => ({
    subvariant: 'custom',
    subvariantOptions: { custom: 'checkout' },
  })
  
  // useAvailableChains: replace with actual chain retrieval logic
  const useAvailableChains = () => ({
    getChainById: (chainId: number) => ({
      id: chainId,
      name: 'MockChain',
    }),
  })
  
  export const useProcessMessage = (step?: LiFiStep, process?: Process) => {
    const { subvariant, subvariantOptions } = useWidgetConfig()
    const { t } = useTranslation()
    const { getChainById } = useAvailableChains()
    if (!step || !process) {
      return {}
    }
    return getProcessMessage(
      t,
      getChainById,
      step,
      process,
      subvariant,
      subvariantOptions
    )
  }
  
  // Mock function replacing actual getProcessMessage function
  function getProcessMessage(
    t: TFunction,
    getChainById: (chainId: number) => EVMChain | undefined,
    step: LiFiStep,
    process: Process,
    subvariant?: string,
    subvariantOptions?: { custom?: string }
  ): {
    title?: string
    message?: string
  } {
    if (process.error && process.status === 'FAILED') {
      const title = t('error.title.unknown')
      const message = process.txHash
        ? t('error.message.transactionFailed')
        : process.error.message || t('error.message.unknown')
      return { title, message }
    }
    const title = t('mock.process.status', { status: process.status })
    return { title }
  }
  