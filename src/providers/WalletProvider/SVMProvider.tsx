import { ConnectionContext } from "@solana/wallet-adapter-react";
import { isItemAllowed } from "../../utils/item.js";
import { useWidgetConfig } from "../WidgetProvider/WidgetProvider.js";
import { SVMExternalContext } from "./SVMExternalContext.js";
import { useContext, type FC, type PropsWithChildren } from "react";
import { SVMBaseProvider } from "./SVMBaseProvider.js";
import { ChainType } from "../../pages/SelectChainPage/types.js";

export function useInSolanaContext(): boolean {
  const { chains } = useWidgetConfig();
  const context = useContext(ConnectionContext);
  return (
    Boolean(context?.connection) && isItemAllowed(ChainType.SVM, chains?.types)
  );
}

export const SVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const inSolanaContext = useInSolanaContext();

  return inSolanaContext ? (
    <SVMExternalContext.Provider value={inSolanaContext}>
      {children}
    </SVMExternalContext.Provider>
  ) : (
    <SVMBaseProvider>{children}</SVMBaseProvider>
  );
};
