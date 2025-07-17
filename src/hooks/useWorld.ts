import { useEffect, useState, useMemo } from "react";
import { getProvider } from "../utils/getProvider";
import { useWidgetConfig } from "../providers/WidgetProvider/WidgetProvider";

export const useWorld = () => {
  const { transactionProvider } = useWidgetConfig();
  const [isWorld, setIsWorld] = useState(false);
  const [provider, setProvider] = useState<any>(null);

  // Memoizamos la promesa para no recrearla en cada render
  const providerPromise = useMemo(
    () => getProvider(transactionProvider),
    [transactionProvider]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      const provider = await providerPromise;
      if (!provider) {
        if (mounted) setIsWorld(false);
        return;
      }
      setProvider(provider);
      const installed = await provider.isInstalled();
      if (mounted) setIsWorld(installed);
    })();

    return () => {
      mounted = false;
    };
  }, [providerPromise]);

  return { isWorld, provider };
};
