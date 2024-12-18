import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";

interface QuoteData {
  digital_asset_amount: number;
  digital_asset: string;
  fiat_amount: number;
  fiat_currency: string;
}

interface QuotesContextType {
  quote: QuoteData | null;
  isPending: boolean;
  fetchQuote: (
    sku: string,
    fiatCurrency: string,
    digitalAsset: string | null
  ) => void;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export const QuotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    data,
    mutate,
    isPending: fetchPending,
  } = useFetch({
    url: "quotes/",
    method: "POST",
    queryOptions: {
      queryKey: ["quote"],
    },
  });

  useEffect(() => {
    setIsPending(fetchPending);
    if (data?.data) {
      setQuote(data.data);
    }
  }, [data, fetchPending]);

  const fetchQuote = (
    sku: string,
    fiatCurrency: string,
    digitalAsset: string | null
  ) => {
    mutate({
      sku,
      fiat_currency: fiatCurrency,
      digital_asset: digitalAsset,
    });
  };

  return (
    <QuotesContext.Provider value={{ quote, isPending, fetchQuote }}>
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
