import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAccount } from '@lifi/wallet-management';

interface QuoteData {
  digitalAssetAmount: number;
  digitalAsset: string;
  totalAmount: number;
  feeAmount: number;
  fiatAmount: number;
  fiatCurrency: string;
}

interface QuotesContextType {
  quote: QuoteData | null;
  isPending: boolean;
  isPurchasePossible: boolean;
  handleCurrentBalanceChange: (newBalance: bigint | null) => void;
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
  const [currentBalance, setCurrentBalance] = useState<bigint | number>(0);
  const [isPurchasePossible, setIsPurchasePossible] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { account } = useAccount();

  const {
    data,
    mutate,
    isPending: fetchPending,
  } = useFetch({
    url: 'quotes/',
    method: 'POST',
    queryOptions: {
      queryKey: ['quote'],
    },
  });

  useEffect(() => {
    setIsPending(fetchPending);
    if (data?.data) {
      setQuote(data.data);
    }
  }, [data, fetchPending]);

  useEffect(() => {
    if ((quote && currentBalance >= quote.totalAmount) || !quote?.totalAmount) {
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
    digitalAsset: string | null
  ) => {
    mutate({
      sku,
      fiatCurrency,
      digitalAsset,
      chainId: account?.chainId,
    });
  };

  useEffect(() => {
    setQuote(null);
  }, [account?.chainId]);

  return (
    <QuotesContext.Provider
      value={{
        quote,
        isPending,
        isPurchasePossible,
        fetchQuote,
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
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  return context;
};
