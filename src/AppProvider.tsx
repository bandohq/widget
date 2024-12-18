import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { Fragment } from "react";
import { MemoryRouter, useInRouterContext } from "react-router-dom";
import { PageEntered } from "./components/PageEntered";
import { queryClient } from "./config/queryClient";
import { ThemeProvider } from "./providers/ThemeProvider/ThemeProvider";
import { WalletProvider } from "./providers/WalletProvider/WalletProvider";
import {
  WidgetProvider,
  useWidgetConfig,
} from "./providers/WidgetProvider/WidgetProvider";
import { StoreProvider } from "./stores/StoreProvider";
import { URLSearchParamsBuilder } from "./stores/form/URLSearchParamsBuilder";
import type { WidgetConfigProps } from "./types/widget";
import { I18nProvider } from "./providers/I18nProvider/I18nProvider";
import { CatalogProvider } from "./providers/CatalogProvider/CatalogProvider";
import { QuotesProvider } from "./providers/QuotesProvider/QuotesProvider";

export const AppProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
  formRef,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetProvider config={config}>
        <I18nProvider>
          <ThemeProvider>
            <WalletProvider>
              <QuotesProvider>
                <StoreProvider config={config} formRef={formRef}>
                  <CatalogProvider>
                    <AppRouter>{children}</AppRouter>
                  </CatalogProvider>
                </StoreProvider>
              </QuotesProvider>
            </WalletProvider>
          </ThemeProvider>
        </I18nProvider>
      </WidgetProvider>
    </QueryClientProvider>
  );
};

export const AppRouter: React.FC<PropsWithChildren> = ({ children }) => {
  const { buildUrl } = useWidgetConfig();
  const inRouterContext = useInRouterContext();
  const Router = inRouterContext ? Fragment : MemoryRouter;
  return (
    <Router>
      {children}
      {buildUrl ? <URLSearchParamsBuilder /> : null}
      <PageEntered />
    </Router>
  );
};
