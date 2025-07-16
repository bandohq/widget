import type { TransactionProvider } from "../types/widget";

export const getProvider = async (
  override?: TransactionProvider
): Promise<TransactionProvider | null> => {
  // instance passed by the integrator
  if (override) return override;

  try {
    // lazy load the minikit-js library
    const { MiniKit } = await import("@worldcoin/minikit-js");
    return MiniKit;
  } catch (err: any) {
    // if the minikit-js library is not found, return null
    if (err?.code === "MODULE_NOT_FOUND") return null;
    throw err;
  }
};
