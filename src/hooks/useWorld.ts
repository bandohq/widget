import { useEffect, useMemo, useState } from "react";
import { getProvider } from "../utils/getProvider";
import { useWidgetConfig } from "../providers/WidgetProvider/WidgetProvider";
import { TransactionProvider } from "../types/widget";

interface WorldState {
  isWorld: boolean;
  provider: TransactionProvider | null;
  error: unknown | null;
}

export const useWorld = (): WorldState => {
  const { transactionProvider } = useWidgetConfig();
  const [state, setState] = useState<WorldState>({
    isWorld: false,
    provider: null,
    error: null,
  });

  const providerPromise = useMemo(
    () => getProvider(transactionProvider),
    [transactionProvider]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const prov = await providerPromise;
        if (!mounted) return;

        if (!prov) {
          setState({ isWorld: false, provider: null, error: null });
          return;
        }

        const installed = await prov.isInstalled();
        if (!mounted) return;

        setState({
          isWorld: installed,
          provider: prov,
          error: null,
        });
      } catch (err) {
        if (mounted) {
          setState({ isWorld: false, provider: null, error: err });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [providerPromise]);

  return state;
};
