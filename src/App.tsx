"use client";
import { forwardRef, useMemo } from "react";
// import { AppDefault } from "./AppDefault.js";
import { AppProvider } from "./AppProvider.js";
import type { WidgetConfig, WidgetProps } from "./types/widget.js";

export const App = forwardRef<unknown, WidgetProps>((props, ref) => {
  const config: WidgetConfig = useMemo(() => {
    return { ...props, ...props.config };
  }, [props]);

  return (
    <AppProvider config={config} formRef={props.formRef}>
      {/* <AppDefault /> */}
    </AppProvider>
  );
});
