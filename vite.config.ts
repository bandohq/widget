import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), dts(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "BandoWidget",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@solana/wallet-adapter-react",
        "@tanstack/react-query",
        "wagmi",
        "@bigmi/react",
        "@worldcoin/minikit-js",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
