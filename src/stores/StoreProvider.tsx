import type { PropsWithChildren } from "react";
import type { WidgetConfigProps } from "../types/widget.js";
import { BookmarkStoreProvider } from "./bookmarks/BookmarkStore";
import { FormStoreProvider } from "./form/FormStore";
import { HeaderStoreProvider } from "./header/useHeaderStore.js";
import { RouteExecutionStoreProvider } from "./routes/RouteExecutionStore.js";
import { SplitSubvariantStoreProvider } from "./settings/useSplitSubvariantStore.js";
import { ProductProvider } from "../providers/ProductProvider/ProductProvider.js";

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
      <ProductProvider>
        <HeaderStoreProvider namePrefix={config?.keyPrefix}>
          <BookmarkStoreProvider namePrefix={config?.keyPrefix}>
            <FormStoreProvider formRef={formRef}>
              <RouteExecutionStoreProvider namePrefix={config?.keyPrefix}>
                {children}
              </RouteExecutionStoreProvider>
            </FormStoreProvider>
          </BookmarkStoreProvider>
        </HeaderStoreProvider>
      </ProductProvider>
    </SplitSubvariantStoreProvider>
  );
};
