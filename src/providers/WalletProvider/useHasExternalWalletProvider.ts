import { useContext, useMemo } from 'react';
import { EVMExternalContext } from './EVMExternalContext';
import { SVMExternalContext } from './SVMExternalContext';
import { ChainTypeCustom } from '../WidgetProvider/types';

interface ExternalWalletProvider {
  hasExternalProvider: boolean;
  providers: ChainTypeCustom[]; 
}

export function useHasExternalWalletProvider(): ExternalWalletProvider {
  const hasExternalEVMContext = useContext(EVMExternalContext);
  const hasExternalSVMContext = useContext(SVMExternalContext);

  // create an array of providers based on the context values 
  const providers = useMemo(() => {
    const providersList: ChainTypeCustom[] = [];
    if (hasExternalEVMContext) {
      providersList.push(ChainTypeCustom.EVM);
    }
    if (hasExternalSVMContext) {
      providersList.push(ChainTypeCustom.SVM);
    }
    return providersList;
  }, [hasExternalEVMContext, hasExternalSVMContext]);

  return {
    hasExternalProvider: hasExternalEVMContext || hasExternalSVMContext,
    providers, 
  };
}
