import type { PropsWithChildren } from "react";
import type { WidgetConfigProps } from "../types/widget.js";
import { BookmarkStoreProvider } from "./bookmarks/BookmarkStore";
import { FormStoreProvider } from "./form/FormStore";
import { HeaderStoreProvider } from "./header/useHeaderStore.js";
import { RouteExecutionStoreProvider } from "./routes/RouteExecutionStore.js";
import { SplitSubvariantStoreProvider } from "./settings/useSplitSubvariantStore.js";
import { ProductProvider } from "./ProductProvider/ProductProvider.js";
import { CountriesProvider } from "./CountriesProvider/CountriesProvider.js";
import { ChainOrderStoreProvider } from "./chains/ChainOrderStore.js";

export const StoreProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
  formRef,
}) => {
  return (
    <SplitSubvariantStoreProvider
      state={
        config.subvariant === "split"
          ? config.subvariantOptions?.split || "swap"
          : undefined
      }
    >
      <CountriesProvider
        blockedCountries={config.blockedCountries}
        configCountry={config.country}
      >
        <ProductProvider>
          <HeaderStoreProvider namePrefix={config?.keyPrefix}>
            <BookmarkStoreProvider namePrefix={config?.keyPrefix}>
              <FormStoreProvider formRef={formRef}>
                <ChainOrderStoreProvider namePrefix={config?.keyPrefix}>
                  <RouteExecutionStoreProvider namePrefix={config?.keyPrefix}>
                    {children}
                  </RouteExecutionStoreProvider>
                </ChainOrderStoreProvider>
              </FormStoreProvider>
            </BookmarkStoreProvider>
          </HeaderStoreProvider>
        </ProductProvider>
      </CountriesProvider>
    </SplitSubvariantStoreProvider>
  );
};
