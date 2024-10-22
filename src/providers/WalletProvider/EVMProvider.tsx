import { type FC, type PropsWithChildren, useContext } from "react";
import { WagmiContext } from "wagmi";
import { isItemAllowed } from "../../utils/item";
import { useWidgetConfig } from "../WidgetProvider/WidgetProvider";
import { EVMBaseProvider } from "./EVMBaseProvider";
import { EVMExternalContext } from "./EVMExternalContext";
import { ChainTypeCustom } from "../WidgetProvider/types";

export const useInWagmiContext = (): boolean => {
  const { chains } = useWidgetConfig();
  const context = useContext(WagmiContext);

  return Boolean(context) && isItemAllowed(ChainTypeCustom.EVM, chains?.types);
};

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const inWagmiContext = useInWagmiContext();

  return inWagmiContext ? (
    <EVMExternalContext.Provider value={inWagmiContext}>
      {children}
    </EVMExternalContext.Provider>
  ) : (
    <EVMBaseProvider>{children}</EVMBaseProvider>
  );
};
