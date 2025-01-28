import type { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import type { SettingsProps, SettingsState } from "./types.js";

export const defaultSlippage = "0.5";

export const defaultConfigurableSettings: Pick<
  SettingsState,
  keyof SettingsState
> = {
  slippage: defaultSlippage,
  gasPrice: "normal",
};

export const defaultSettings: SettingsProps = {
  appearance: "auto",
  gasPrice: "normal",
};

export const useSettingsStore = createWithEqualityFn<SettingsState>(
  persist(
    (set, get) => ({
      ...defaultSettings,
      setValue: (key, value) =>
        set(() => ({
          [key]: value,
        })),
      getSettings: () => get(),
      getValue: (key) => get()[key],
      reset: () => {
        const { appearance, ...restDefaultSettings } = defaultSettings;
        set(() => ({
          ...restDefaultSettings,
          ...defaultConfigurableSettings,
        }));
        return { ...get() };
      },
    }),
    {
      name: "bando-widget-settings",
      version: 1,
      partialize: (state) => {
        const { ...partializedState } = state;
        return partializedState;
      },
      merge: (persistedState: any, currentState: SettingsState) => {
        const state = { ...currentState, ...persistedState };
        return state;
      },
      migrate: (persistedState: any, version) => {
        if (version === 0 && persistedState.appearance === "system") {
          persistedState.appearance = defaultSettings.appearance;
        }
        if (version === 1) {
          persistedState.slippage = defaultConfigurableSettings.slippage;
        }
        return persistedState as SettingsState;
      },
    }
  ) as unknown as StateCreator<SettingsState, [], [], SettingsState>,
  Object.is
);
