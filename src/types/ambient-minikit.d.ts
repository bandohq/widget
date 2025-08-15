import type { TransactionProvider } from "./widget";

declare module "@worldcoin/minikit-js" {
  export const MiniKit: TransactionProvider;
}
