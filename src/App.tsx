"use client";
import { forwardRef, useEffect, useMemo } from "react";
import { AppDefault } from "./AppDefault.js";
import { AppProvider } from "./AppProvider.js";
import type { WidgetConfig, WidgetProps } from "./types/widget.js";
import { LaunchDarklyProvider } from "./providers/LaunchDarklyProvider/LaunchDarklyProvider.js";
import "react-phone-number-input/style.css";
import { MiniKit } from "@worldcoin/minikit-js";

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

  useEffect(() => {
    console.log("MiniKit.isInstalled()", MiniKit.isInstalled());
  }, []);
  return (
    <AppProvider config={config} formRef={props.formRef}>
      <LaunchDarklyProvider>
        <AppDefault />
      </LaunchDarklyProvider>
    </AppProvider>
  );
});
