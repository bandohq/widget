import type { TransactionProvider } from "../types/widget";

export const getProvider = async (
  override?: TransactionProvider
): Promise<TransactionProvider | null> => {
  if (override) return override;
  try {
    const loadMiniKit = async (): Promise<TransactionProvider> => {
      // @ts-ignore - Ignore type error for dynamic import
      const module = await import("@worldcoin/minikit-js");
      return module.MiniKit as TransactionProvider;
    };

    return await loadMiniKit();
  } catch (err: any) {
    const code = err?.code || err?.name;
    const msg = String(err?.message || err);
    if (
      code === "MODULE_NOT_FOUND" ||
      code === "ERR_MODULE_NOT_FOUND" ||
      /Cannot find module/.test(msg)
    ) {
      return null;
    }
    throw err;
  }
};
