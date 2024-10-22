import { useContext, useMemo } from 'react';
import { EVMExternalContext } from './EVMExternalContext';
import { SVMExternalContext } from './SVMExternalContext';
import { UTXOExternalContext } from './UTXOExternalContext';
import { ChainTypeCustom } from '../WidgetProvider/types';

interface ExternalWalletProvider {
  hasExternalProvider: boolean;
  availableChainTypes: ChainTypeCustom[]; 
}

export function useHasExternalWalletProvider(): ExternalWalletProvider {
  const hasExternalEVMContext = useContext(EVMExternalContext)
  const hasExternalSVMContext = useContext(SVMExternalContext)
  const hasExternalUTXOContext = useContext(UTXOExternalContext)

  const providers = useMemo(() => {
    const providers: ChainTypeCustom[] = []
    if (hasExternalEVMContext) {
      providers.push(ChainTypeCustom.EVM)
    }
    if (hasExternalSVMContext) {
      providers.push(ChainTypeCustom.SVM)
    }
    if (hasExternalUTXOContext) {
      providers.push(ChainTypeCustom.UTXO)
    }
    return providers
  }, [hasExternalEVMContext, hasExternalSVMContext, hasExternalUTXOContext])

  return {
    hasExternalProvider:
      hasExternalEVMContext || hasExternalSVMContext || hasExternalUTXOContext,
      availableChainTypes: providers,
  }
}
