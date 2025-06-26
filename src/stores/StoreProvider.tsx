import type { PropsWithChildren } from "react";
import type { WidgetConfigProps } from "../types/widget.js";
import { FormStoreProvider } from "./form/FormStore";
import { HeaderStoreProvider } from "./header/useHeaderStore.js";
import { ProductProvider } from "./ProductProvider/ProductProvider.js";
import { CountriesProvider } from "./CountriesProvider/CountriesProvider.js";
import { ChainOrderStoreProvider } from "./chains/ChainOrderStore.js";

export const StoreProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
  formRef,
}) => {
  return (
    <CountriesProvider
      allowedCountries={config.allowedCountries}
      configCountry={config.country}
    >
      <ProductProvider>
        <HeaderStoreProvider namePrefix={config?.keyPrefix}>
          <FormStoreProvider formRef={formRef}>
            <ChainOrderStoreProvider namePrefix={config?.keyPrefix}>
              {children}
            </ChainOrderStoreProvider>
          </FormStoreProvider>
        </HeaderStoreProvider>
      </ProductProvider>
    </CountriesProvider>
  );
};
