"use client";
import { forwardRef, useMemo } from "react";
import { AppDefault } from "./AppDefault.js";
import { AppProvider } from "./AppProvider.js";
import type { WidgetConfig, WidgetProps } from "./types/widget.js";
import { LDProvider } from "launchdarkly-react-client-sdk";
import "react-phone-number-input/style.css";

export const App = forwardRef<unknown, WidgetProps>((props, ref) => {
  const config: WidgetConfig = useMemo(() => {
    const config = { ...props, ...props.config };
    if (config.variant === "drawer") {
      config.theme = {
        ...config.theme,
        container: {
          height: "100%",
          ...config.theme?.container,
        },
      };
    }
    return config;
  }, [props]);

  return (
    // TODO: Replace with your LaunchDarkly client side ID
    <LDProvider clientSideID="1234567890">
      <AppProvider config={config} formRef={props.formRef}>
        <AppDefault />
      </AppProvider>
    </LDProvider>
  );
});
