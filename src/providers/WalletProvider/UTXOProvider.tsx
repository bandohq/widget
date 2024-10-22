import { BigmiContext } from "@bigmi/react";
import { ChainTypeCustom } from "../WidgetProvider/types";
import { type FC, type PropsWithChildren, useContext } from "react";
import { isItemAllowed } from "../../utils/item";
import { useWidgetConfig } from "../WidgetProvider/WidgetProvider";
import { UTXOBaseProvider } from "./UTXOBaseProvider";
import { UTXOExternalContext } from "./UTXOExternalContext";

export const useInBigmiContext = (): boolean => {
  const { chains } = useWidgetConfig();
  const context = useContext(BigmiContext);

  return Boolean(context) && isItemAllowed(ChainTypeCustom.UTXO, chains?.types);
};

export const UTXOProvider: FC<PropsWithChildren> = ({ children }) => {
  const inBigmiContext = useInBigmiContext();

  return inBigmiContext ? (
    <UTXOExternalContext.Provider value={inBigmiContext}>
      {children}
    </UTXOExternalContext.Provider>
  ) : (
    <UTXOBaseProvider>{children}</UTXOBaseProvider>
  );
};
