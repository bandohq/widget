import React, { useEffect, useState, useMemo, useRef } from "react";
import { LDProvider } from "launchdarkly-react-client-sdk";
import { useAccount } from "@lifi/wallet-management";

type LaunchDarklyProviderProps = {
  children: React.ReactNode;
};

export const LaunchDarklyProvider: React.FC<LaunchDarklyProviderProps> = ({
  children,
}) => {
  const { account } = useAccount();
  const [contextKey, setContextKey] = useState<string>("anonymous");
  const [isInitialized, setIsInitialized] = useState(false);
  const previousAddressRef = useRef<string | undefined>();

  const context = useMemo(
    () => ({
      key: contextKey,
    }),
    [contextKey]
  );

  useEffect(() => {
    const currentAddress = account?.address;

    // Update the context key if the account address changes
    if (currentAddress !== previousAddressRef.current) {
      const newKey = currentAddress || "anonymous";
      setContextKey(newKey);
      previousAddressRef.current = currentAddress;

      if (!isInitialized) {
        setIsInitialized(true);
      }
    } else if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [account?.address, isInitialized]);

  // Don't render until we have initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <LDProvider
      clientSideID="68533cbf1d687d0946833532"
      context={context}
      key={contextKey}
    >
      {children}
    </LDProvider>
  );
};
