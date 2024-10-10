// import { ChainType } from "@lifi/sdk";
import { type FC, type PropsWithChildren } from "react";
// import { WagmiContext } from "wagmi";
// import { useWidgetConfig } from "../WidgetProvider/WidgetProvider.js";
import { EVMBaseProvider } from "./EVMBaseProvider.js";
//import { EVMExternalContext } from "./EVMExternalContext.js";

// export function useInWagmiContext(): boolean {
//   const { chains } = useWidgetConfig();
//   const context = useContext(WagmiContext);

//   return Boolean(context) && isItemAllowed(ChainType.EVM, chains?.types);
// }

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  // const inWagmiContext = useInWagmiContext();

  return <EVMBaseProvider>{children}</EVMBaseProvider>;
};
