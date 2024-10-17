import { createContext, useContext, useId, useMemo } from "react";
import { setDefaultSettings } from "../../stores/settings/useSettingStore";
import type { WidgetContextProps, WidgetProviderProps } from "./types";

const initialContext: WidgetContextProps = {
  elementId: "",
  integrator: "",
};

const WidgetContext = createContext<WidgetContextProps>(initialContext);

export const useWidgetConfig = (): WidgetContextProps =>
  useContext(WidgetContext);

export const WidgetProvider: React.FC<
  React.PropsWithChildren<WidgetProviderProps>
> = ({ children, config: widgetConfig }) => {
  const elementId = useId();

  if (!widgetConfig?.integrator) {
    throw Error('Required property "integrator" is missing.');
  }

  const value = useMemo((): WidgetContextProps => {
    try {
      // Create widget configuration object
      const value = {
        ...widgetConfig,
        elementId,
      } as WidgetContextProps;

      // Set default settings for widget settings store
      setDefaultSettings(value);

      return value;
    } catch (e) {
      console.warn(e);
      return {
        ...widgetConfig,
        elementId,
        integrator: widgetConfig.integrator,
      };
    }
  }, [elementId, widgetConfig]);
  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};
