import { useAccount } from "@lifi/wallet-management";
import { useEffect } from "react";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";
import { formDefaultValues } from "../../stores/form/createFormStore.js";
import type { DefaultValues } from "./types.js";
import { useFieldActions } from "./useFieldActions.js";
import { useWorld } from "../../hooks/useWorld.js";

export const FormUpdater: React.FC<{
  reactiveFormValues: Partial<DefaultValues>;
}> = ({ reactiveFormValues }) => {
  const { fromChain } = useWidgetConfig();
  const { account } = useAccount();
  const { isWorld } = useWorld();
  const { isTouched, resetField, setFieldValue, setUserAndDefaultValues } =
    useFieldActions();

  const chainId = isWorld ? 480 : account.chainId;

  // Set wallet chain as default if they were not changed during widget usage
  useEffect(() => {
    if ((!account.isConnected && !isWorld) || !chainId) {
      return;
    }

    if (!fromChain && !isTouched("fromChain") && !isTouched("fromToken")) {
      resetField("fromChain", {
        defaultValue: chainId,
      });
      setFieldValue("fromToken", "");
      if (isTouched("fromAmount")) {
        setFieldValue("fromAmount", "");
      }
    }
  }, [
    chainId,
    account.isConnected,
    fromChain,
    isWorld,
    isTouched,
    resetField,
    setFieldValue,
  ]);

  // Makes widget config options reactive to changes
  // should update userValues when defaultValues updates
  useEffect(() => {
    setUserAndDefaultValues(accountForChainId(reactiveFormValues, chainId));
  }, [chainId, reactiveFormValues, setUserAndDefaultValues]);

  return null;
};

const accountForChainId = (
  defaultValues: Partial<DefaultValues>,
  chainId?: number
) => {
  const result: Partial<DefaultValues> = { ...defaultValues };
  for (const key in result) {
    const k = key as keyof DefaultValues;
    if (result[k] === formDefaultValues[k]) {
      if (k === "fromChain" && chainId) {
        result[k] = chainId;
      }
    }
  }
  return result;
};
