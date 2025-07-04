import type { DefaultWagmiConfigResult } from "@lifi/wallet-management";
import {
  createDefaultWagmiConfig,
  useSyncWagmiConfig,
} from "@lifi/wallet-management";
import {
  type FC,
  type PropsWithChildren,
  useState,
  useRef,
  useEffect,
} from "react";
import { WagmiProvider } from "wagmi";
import { defaultCoinbaseConfig } from "../../config/coinbase";
import { defaultMetaMaskConfig } from "../../config/metaMask";
import { defaultWalletConnectConfig } from "../../config/walletConnect";
import { useWidgetConfig } from "../WidgetProvider/WidgetProvider";
import { useChains } from "../../hooks/useChains";
import { transformToChainConfig } from "../../utils/TransformToChainConfig";
import { ExtendedChain } from "../../pages/SelectChainPage/types";

export const EVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains, isLoading } = useChains();
  const { walletConfig } = useWidgetConfig();
  const [availableChains, setAvailableChains] = useState([]);
  const wagmi = useRef<DefaultWagmiConfigResult>();

  useEffect(() => {
    if (!isLoading) {
      const customChains = chains
        ?.filter((chain) => chain.isActive)
        .map((chain) => {
          if (!chain.nativeToken)
            throw new Error(`Native token required for chain ${chain.name}`);
          return transformToChainConfig(chain, chain.nativeToken);
        });

      setAvailableChains(customChains);
    }
  }, [chains, isLoading]);

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

  useSyncWagmiConfig(
    wagmi.current.config,
    wagmi.current.connectors,
    // @ts-ignore
    availableChains
  );

  return (
    <WagmiProvider config={wagmi.current.config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  );
};
