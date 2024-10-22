import type { WalletManagementConfig } from "@lifi/wallet-management";
import { WalletManagementProvider } from "@lifi/wallet-management";
import { type FC, type PropsWithChildren, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useWidgetConfig } from "../WidgetProvider/WidgetProvider";
import { EVMProvider } from "./EVMProvider";
import { SVMProvider } from "./SVMProvider";
import { UTXOProvider } from "./UTXOProvider";

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <EVMProvider>
      <SVMProvider>
        <UTXOProvider>
          <WalletMenuProvider>{children}</WalletMenuProvider>
        </UTXOProvider>
      </SVMProvider>
    </EVMProvider>
  );
};

export const WalletMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig();
  const { i18n } = useTranslation();

  const config: WalletManagementConfig = useMemo(() => {
    return { locale: i18n.resolvedLanguage as never, ...walletConfig };
  }, [i18n.resolvedLanguage, walletConfig]);
  return (
    <WalletManagementProvider config={config}>
      {children}
    </WalletManagementProvider>
  );
};
