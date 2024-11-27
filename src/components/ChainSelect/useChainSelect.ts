import { useChains } from '../../hooks/useChains';
import { EVMChain } from '../../pages/SelectChainPage/types';
import { useExternalWalletProvider } from '../../providers/WalletProvider/useExternalWalletProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useChainOrder } from '../../stores/chains/useChainOrder.js';
import type { FormType } from '../../stores/form/types.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldActions } from '../../stores/form/useFieldActions.js';
import { useFieldController } from '../../stores/form/useFieldController.js';
import type { DisabledUI } from '../../types/widget.js';

export const useChainSelect = (formType: FormType) => {
  const { disabledUI } = useWidgetConfig();
  const chainKey = FormKeyHelper.getChainKey(formType);
  const { onChange } = useFieldController({ name: chainKey });
  const { setFieldValue, getFieldValues } = useFieldActions();
  const { useExternalWalletProvidersOnly, externalChainTypes } =
    useExternalWalletProvider();
  const { chains, isLoading, getChainById } = useChains(
    formType,
    formType === 'from' && useExternalWalletProvidersOnly
      ? externalChainTypes
      : undefined
  );

  const [chainOrder, setChainOrder] = useChainOrder(formType);

  const getChains = () => {
    if (!chains) {
      return [];
    }
    const selectedChains = chainOrder
      .map((chainId) => chains.find((chain) => chain.id === chainId))
      .filter(Boolean) as EVMChain[];
    return selectedChains;
  };

  const setCurrentChain = (chainId: number) => {
    onChange(chainId);
    const tokenKey = FormKeyHelper.getTokenKey(formType);
    if (!disabledUI?.includes(tokenKey as DisabledUI)) {
      setFieldValue(tokenKey, '');
    }
    const amountKey = FormKeyHelper.getAmountKey(formType);
    if (!disabledUI?.includes(amountKey as DisabledUI)) {
      setFieldValue(amountKey, '');
    }
    setFieldValue('tokenSearchFilter', '');

    // Ajusta el orden de las chains
    setChainOrder(chainId, formType);
  };

  return {
    chainOrder,
    chains,
    getChains,
    isLoading,
    setChainOrder,
    setCurrentChain,
  };
};
