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
import nativeTokenCatalog, {
  NativeTokenCatalog,
} from "../../utils/nativeTokenCatalog";

export const EVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useChains();
  const { walletConfig } = useWidgetConfig();
  const [availableChains, setAvailableChains] = useState<NativeTokenCatalog[]>(
    []
  );
  const wagmi = useRef<DefaultWagmiConfigResult>();

  useEffect(() => {
    const customChains = chains?.map((chain) => {
      const nativeToken = nativeTokenCatalog.find(
        (item) => item.key === chain?.key
      );
      return transformToChainConfig(chain, nativeToken);
    });

    setAvailableChains(customChains);
  }, [chains]);

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
    availableChains
  );

  return (
    <WagmiProvider config={wagmi.current.config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  );
};
