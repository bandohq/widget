import type { TransactionProvider } from "../types/widget";

export const getTokenToDecimals = async () => {
  try {
    // lazy load the minikit-js library
    const { tokenToDecimals } = await import("@worldcoin/minikit-js");
    return tokenToDecimals;
  } catch (err: any) {
    // if the minikit-js library is not found, return null
    if (err?.code === "MODULE_NOT_FOUND") return null;
    throw err;
  }
};
