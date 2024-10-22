import type { DefaultWagmiConfigResult } from "@lifi/wallet-management";
import {
  createDefaultWagmiConfig,
  useSyncWagmiConfig,
} from "@lifi/wallet-management";
import { type FC, type PropsWithChildren, useRef } from "react";
import { WagmiProvider } from "wagmi";
import { defaultCoinbaseConfig } from "../../config/coinbase";
import { defaultMetaMaskConfig } from "../../config/metaMask";
import { defaultWalletConnectConfig } from "../../config/walletConnect";
import { useWidgetConfig } from "../WidgetProvider/WidgetProvider";

export const EVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig();
  const wagmi = useRef<DefaultWagmiConfigResult>();

  if (!wagmi.current) {
    wagmi.current = createDefaultWagmiConfig({
      coinbase: walletConfig?.coinbase ?? defaultCoinbaseConfig,
      metaMask: walletConfig?.metaMask ?? defaultMetaMaskConfig,
      walletConnect: walletConfig?.walletConnect ?? defaultWalletConnectConfig,
      wagmiConfig: {
        ssr: true,
      },
      lazy: true,
    });
  }

  useSyncWagmiConfig(wagmi.current.config, wagmi.current.connectors);

  return (
    <WagmiProvider config={wagmi.current.config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  );
};
