// Simplified export-only version

import type { StateCreator } from "zustand";
import type { WidgetConfig } from "../../types/widget.js";
import type { SettingsProps, SettingsState } from "./types.js";

// Valores por defecto simplificados
export const defaultSlippage = "0.5";

export const defaultConfigurableSettings: Pick<
  SettingsState,
  "routePriority" | "slippage" | "gasPrice"
> = {
  routePriority: "CHEAPEST",
  slippage: defaultSlippage,
  gasPrice: "normal",
};

export const defaultSettings: SettingsProps = {
  appearance: "auto",
  gasPrice: "normal",
  enabledAutoRefuel: true,
  disabledBridges: [],
  disabledExchanges: [],
  enabledBridges: [],
  enabledExchanges: [],
  _enabledBridges: {},
  _enabledExchanges: {},
};

// Dummy store with zustand compatibility, without actual logic
export const useSettingsStore = {
  getState: () => ({
    ...defaultSettings,
    setValue: (key: keyof SettingsProps, value: any) => {},
    setValues: (values: Partial<SettingsProps>) => {},
    initializeTools: (toolType: string, tools: string[], reset: boolean) => {},
    setToolValue: (toolType: string, tool: string, value: boolean) => {},
    toggleToolKeys: (toolType: string, toolKeys: string[]) => {},
    reset: (bridges: string[], exchanges: string[]) => {},
  }),
} as unknown as StateCreator<SettingsState, [], [], SettingsState>;

// Function mock, only setting defaults without logic
export const setDefaultSettings = (config?: WidgetConfig) => {
  const { slippage, routePriority, setValue, gasPrice } =
    useSettingsStore.getState();
  const defaultSlippage =
    (config?.slippage || config?.sdkConfig?.routeOptions?.slippage || 0) * 100;
  const defaultRoutePriority =
    config?.routePriority || config?.sdkConfig?.routeOptions?.order;

  defaultConfigurableSettings.slippage = (
    defaultSlippage || defaultConfigurableSettings.slippage
  ).toString();
  defaultConfigurableSettings.routePriority =
    defaultRoutePriority || defaultConfigurableSettings.routePriority;

  if (!slippage) setValue("slippage", defaultConfigurableSettings.slippage);
  if (!routePriority)
    setValue("routePriority", defaultConfigurableSettings.routePriority);
  if (!gasPrice) setValue("gasPrice", defaultConfigurableSettings.gasPrice);
};
