import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAccount } from "@lifi/wallet-management";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNotificationContext } from "../AlertProvider/NotificationProvider";
import { useTranslation } from "react-i18next";

export interface TransactionRequest {
  chainId: number;
  type: number;
  to: string;
  data: string;
  value: string;
  gas: string;
  gasLimit: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

interface QuoteError {
  error: string;
  message: string;
  status: number;
  data?: {
    error_code: string;
    error_type: string;
    reason: string;
    message: string;
  };
}

interface QuoteData {
  id: number;
  digitalAssetAmount: string;
  digitalAsset: string;
  totalAmount: string;
  feeAmount: string;
  fiatAmount: string;
  fiatCurrency: string;
  transactionRequest?: TransactionRequest;
}

interface QuotesContextType {
  quote: QuoteData | null;
  isPending: boolean;
  isPurchasePossible: boolean;
  error: QuoteError | null;
  handleCurrentBalanceChange: (newBalance: bigint | null) => void;
  resetQuote: () => void;
  fetchQuote: (
    sku: string,
    fiatCurrency: string,
    digitalAsset: string | null,
    transactionFlow: boolean
  ) => void;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export const QuotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showNotification } = useNotificationContext();
  const { account } = useAccount();
  const { product } = useProduct();
  const { t } = useTranslation();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [currentBalance, setCurrentBalance] = useState<bigint | number>(0);
  const [isPurchasePossible, setIsPurchasePossible] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<QuoteError | null>(null);

  const {
    data,
    mutate,
    isPending: fetchPending,
    error: fetchError,
  } = useFetch({
    url: "quotes/",
    method: "POST",
  });

  useEffect(() => {
    setIsPending(fetchPending);
    if (data?.data) {
      setQuote({
        ...data.data,
      });
    }
  }, [data, fetchPending]);

  useEffect(() => {
    if (fetchError) {
      setQuote(null);
      if (fetchError.message === "INSUFFICIENT_BALANCE") {
        setError({
          error: "INSUFFICIENT_BALANCE",
          message: t("warning.message.insufficientFunds"),
          status: 400,
        });
        setIsPurchasePossible(false);
      } else {
        setError({
          error: "UNKNOWN_ERROR",
          message: t("error.message.quoteFailed"),
          status: 400,
        });
        showNotification("error", t("error.message.quoteFailed"));
      }
    } else {
      setError(null);
    }
  }, [fetchError]);

  useEffect(() => {
    if (
      (quote && Number(currentBalance) >= Number(quote.totalAmount)) ||
      !quote?.totalAmount
    ) {
      setIsPurchasePossible(true);
    } else {
      setIsPurchasePossible(false);
    }
  }, [currentBalance, quote]);

  const handleCurrentBalanceChange = (newBalance: bigint | null) => {
    setCurrentBalance(newBalance || 0);
  };

  const fetchQuote = (
    sku: string,
    fiatCurrency: string,
    digitalAsset: string | null,
    transactionFlow: boolean
  ) => {
    mutate({
      sku,
      fiatCurrency,
      digitalAsset,
      sender: transactionFlow ? account?.address : undefined,
      chainId: account?.chainId,
    });
  };

  const resetQuote = () => {
    setQuote(null);
  };

  useEffect(() => {
    resetQuote();
  }, [account?.chainId, product?.sku]);

  return (
    <QuotesContext.Provider
      value={{
        quote,
        isPending,
        isPurchasePossible,
        error,
        fetchQuote,
        resetQuote,
        handleCurrentBalanceChange,
      }}
    >
      {children}
    </QuotesContext.Provider>
  );
};

export const useQuotes = (): QuotesContextType => {
  const context = useContext(QuotesContext);
  if (!context) {
    throw new Error("useQuotes must be used within a QuotesProvider");
  }
  return context;
};
