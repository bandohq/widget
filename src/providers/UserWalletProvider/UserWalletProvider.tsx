import React, { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAccount } from "@lifi/wallet-management";
import { useWidgetConfig } from "../WidgetProvider/WidgetProvider";
import { Adress } from "../../pages/SelectChainPage/types";

type WalletInfo = {
  errorCode?: string;
  message?: string;
  wallet?: {
    hasAcceptedTerms: boolean;
    walletAddress: Adress;
  };
};

type UserWalletContextType = {
  walletInfo: WalletInfo | null;
  isPending: boolean;
  error: Error | null;
  userAcceptedTermsAndConditions: boolean;
  setUserAcceptedTermsAndConditions: (value: boolean) => void;
};

const UserWalletContext = createContext<UserWalletContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const UserWalletProvider = ({ children }: Props) => {
  const { account } = useAccount();
  const { integrator } = useWidgetConfig();
  const [userAcceptedTermsAndConditions, setUserAcceptedTermsAndConditions] =
    useState(false);

  const {
    data: walletInfo,
    isPending,
    error,
  } = useFetch({
    url: `wallets/${account.address}/`,
    method: "GET",
    queryParams: {
      integrator: integrator,
    },
    queryOptions: {
      queryKey: ["wallet-info", account.address, integrator],
      retry: false,
      enabled: !!account.address,
    },
  });

  useEffect(() => {
    if (
      walletInfo?.wallet &&
      walletInfo.wallet.hasAcceptedTerms !== undefined
    ) {
      setUserAcceptedTermsAndConditions(walletInfo.wallet.hasAcceptedTerms);
    }
  }, [walletInfo]);

  return (
    <UserWalletContext.Provider
      value={{
        walletInfo,
        isPending,
        error,
        userAcceptedTermsAndConditions,
        setUserAcceptedTermsAndConditions,
      }}
    >
      {children}
    </UserWalletContext.Provider>
  );
};

export const useUserWallet = () => {
  const context = useContext(UserWalletContext);
  if (!context) {
    throw new Error("useUserWallet must be used within a UserWalletProvider");
  }
  return context;
};
