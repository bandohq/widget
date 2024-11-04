import { BigmiContext } from "@bigmi/react";
import { type FC, type PropsWithChildren, useContext } from "react";
import { isItemAllowed } from "../../utils/item.js";
import { UTXOBaseProvider } from "./UTXOBaseProvider.js";
import { UTXOExternalContext } from "./UTXOExternalContext.js";
import { ChainTypeCustom } from "../WidgetProvider/types.js";

export function useInBigmiContext(): boolean {
  const context = useContext(BigmiContext);

  return Boolean(context) && isItemAllowed(ChainTypeCustom.UTXO);
}

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
