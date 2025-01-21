import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import type { widgetEvents } from '../../hooks/useWidgetEvents';
import { useWidgetEvents } from '../../hooks/useWidgetEvents';
import { WidgetEvent } from '../../types/events';
import type { WidgetConfig } from '../../types/widget';
import { deepEqual } from '../../utils/deepEqual';
import type { SettingsActions, SettingsProps, ValueSetter } from './types';
import { defaultConfigurableSettings, useSettingsStore } from './useSettingsStore';

const emitEventOnChange = <T extends (...args: any[]) => any>(
  emitter: typeof widgetEvents,
  actions: Omit<SettingsActions, 'initializeTools'>,
  settingFunction: T,
  ...args: Parameters<T>
) => {
  const oldSettings = actions.getSettings();

  settingFunction(...args);

  const newSettings = actions.getSettings();

  if (!deepEqual(oldSettings, newSettings)) {
    (Object.keys(oldSettings) as (keyof SettingsProps)[]).forEach((key) => {
      if (!deepEqual(oldSettings[key], newSettings[key])) {
        emitter.emit(WidgetEvent.SettingUpdated, {
          setting: key,
          newValue: newSettings[key],
          oldValue: oldSettings[key],
          newSettings,
          oldSettings,
        });
      }
    });
  }
};

export const useSettingsActions = () => {
  const emitter = useWidgetEvents();
  const actions = useSettingsStore(
    (state) => ({
      setValue: state.setValue,
      getValue: state.getValue,
      getSettings: state.getSettings,
      reset: state.reset,
    }),
    shallow
  );

  const setValueWithEmittedEvent = useCallback<ValueSetter<SettingsProps>>(
    (key, value) => {
      emitEventOnChange(emitter, actions, actions.setValue, key, value);
    },
    [emitter, actions]
  );

  const setDefaultSettingsWithEmittedEvents = useCallback(
    (config?: WidgetConfig) => {
      const slippage = actions.getValue('slippage');
      const gasPrice = actions.getValue('gasPrice');

      const defaultSlippage =
        (config?.slippage || config?.sdkConfig?.routeOptions?.slippage || 0) * 100;

      defaultConfigurableSettings.slippage = (
        defaultSlippage || defaultConfigurableSettings.slippage
      ).toString();

      if (!slippage) {
        setValueWithEmittedEvent('slippage', defaultConfigurableSettings.slippage);
      }
      if (!gasPrice) {
        setValueWithEmittedEvent('gasPrice', defaultConfigurableSettings.gasPrice);
      }
    },
    [actions, setValueWithEmittedEvent]
  );

  return {
    setValue: setValueWithEmittedEvent,
    setDefaultSettings: setDefaultSettingsWithEmittedEvents,
  };
};
