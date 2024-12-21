import type { PropsWithChildren } from "react";
import { useMemo, useRef } from "react";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import type { FormRef, ToAddress } from "../../types/widget";
import { FormStoreContext } from "./FormStoreContext";
import { FormUpdater } from "./FormUpdater";
import { createFormStore, formDefaultValues } from "./createFormStore";
import type { DefaultValues, FormStoreStore } from "./types";
import { useFormRef } from "./useFormRef";

// decorates and initialise the form date for use in the form store
const initialiseDefaultValues = (
  defaultValues: Partial<DefaultValues>,
  fromAmount?: number | string,
  toAmount?: number | string,
  toAddress?: ToAddress,
  hiddenToAddress?: boolean
) => ({
  ...formDefaultValues,
  ...defaultValues,
  fromAmount:
    (typeof fromAmount === "number" ? fromAmount?.toPrecision() : fromAmount) ||
    formDefaultValues.fromAmount,
  toAmount:
    (typeof toAmount === "number" ? toAmount?.toPrecision() : toAmount) ||
    formDefaultValues.toAmount,
  // Prevent setting address when the field is hidden
  toAddress: hiddenToAddress
    ? formDefaultValues.toAddress
    : toAddress?.address || formDefaultValues.toAddress,
});

interface FormStoreProviderProps extends PropsWithChildren {
  formRef?: FormRef;
}

export const FormStoreProvider: React.FC<FormStoreProviderProps> = ({
  children,
  formRef,
}) => {
  const widgetConfig = useWidgetConfig();

  const { fromChain, fromToken, toChain, toAmount, formUpdateKey } =
    widgetConfig;

  const storeRef = useRef<FormStoreStore>();

  const configHasFromChain = Object.hasOwn(widgetConfig, "fromChain");
  const configHasFromToken = Object.hasOwn(widgetConfig, "fromToken");
  const configHasToAmount = Object.hasOwn(widgetConfig, "toAmount");
  const configHasToAddress = Object.hasOwn(widgetConfig, "toAddress");
  const configHasToChain = Object.hasOwn(widgetConfig, "toChain");
  const configHasToToken = Object.hasOwn(widgetConfig, "toToken");

  // We use the presence/absence of a property to decide if the form values in state need to be updated
  // We only build and set a property on the memoized form values here if they are included in the
  // config - undefined is considered a valid value that will reset that form field
  // biome-ignore lint/correctness/useExhaustiveDependencies: formUpdateKey is needed here.
  const reactiveFormValues = useMemo(
    () => ({
      ...(configHasFromChain ? { fromChain } : undefined),
      ...(configHasFromToken ? { fromToken } : undefined),
      ...(configHasToAmount
        ? {
            toAmount:
              (typeof toAmount === "number"
                ? toAmount?.toPrecision()
                : toAmount) || formDefaultValues.toAmount,
          }
        : undefined),
    }),
    [
      toAmount,
      fromChain,
      fromToken,
      toChain,
      // formUpdateKey should be a randomly assigned unique key. It can be used to force updates for the form field values
      formUpdateKey,
      configHasFromChain,
      configHasFromToken,
      configHasToAmount,
      configHasToAddress,
      configHasToChain,
      configHasToToken,
    ]
  );

  if (!storeRef.current) {
    storeRef.current = createFormStore(
      initialiseDefaultValues(reactiveFormValues, toAmount)
    );
  }

  useFormRef(storeRef.current, formRef);

  return (
    <FormStoreContext.Provider value={storeRef.current}>
      {children}
      <FormUpdater reactiveFormValues={reactiveFormValues} />
    </FormStoreContext.Provider>
  );
};
