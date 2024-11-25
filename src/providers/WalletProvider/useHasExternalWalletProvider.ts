import { useContext, useMemo } from 'react';
import { EVMExternalContext } from './EVMExternalContext';
import { SVMExternalContext } from './SVMExternalContext';
import { UTXOExternalContext } from './UTXOExternalContext';
import { ChainType } from '../../pages/SelectChainPage/types';

interface ExternalWalletProvider {
  hasExternalProvider: boolean;
  availableChainTypes: ChainType[]; 
}

export function useHasExternalWalletProvider(): ExternalWalletProvider {
  const hasExternalEVMContext = useContext(EVMExternalContext)
  const hasExternalSVMContext = useContext(SVMExternalContext)
  const hasExternalUTXOContext = useContext(UTXOExternalContext)

  const providers = useMemo(() => {
    const providers: ChainType[] = []
    if (hasExternalEVMContext) {
      providers.push(ChainType.EVM)
    }
    if (hasExternalSVMContext) {
      providers.push(ChainType.SVM)
    }
    if (hasExternalUTXOContext) {
      providers.push(ChainType.UTXO)
    }
    return providers
  }, [hasExternalEVMContext, hasExternalSVMContext, hasExternalUTXOContext])

  return {
    hasExternalProvider:
      hasExternalEVMContext || hasExternalSVMContext || hasExternalUTXOContext,
      availableChainTypes: providers,
  }
}
