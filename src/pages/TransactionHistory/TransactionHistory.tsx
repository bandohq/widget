import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { useFetch } from "../../hooks/useFetch";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { List } from "@mui/material";
import { TokenListItemSkeleton } from "../../components/TokenList/TokenListItem";
import { useConfig } from "wagmi";
import { useChain } from "../../hooks/useChain";
import { fetchRefunds } from "../../utils/refunds";

export interface Transaction {
  id: string;
  serviceId: string;
  created: string;
  tokenUsed: string;
  status: string;
  productType: string;
  walletAddress: string;
  brandName: string;
  product: {
    name: string;
    logoUrl: string;
  };
  price: {
    fiatCurrency: string;
    fiatValue: string;
  };
}

export const TransactionsHistoryPage = () => {
  const { t } = useTranslation();
  const config = useConfig();
  useHeader(t("history.title"));
  const { account } = useAccount();
  const { chain } = useChain(account.chainId);
  const [refunds, setRefunds] = useState<{ id: string; amount: BigInt }[]>([]);

  const { data: transactions, isPending } = useFetch({
    url: account.address ? `wallets/${account.address}/transactions` : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transactions", account.address, account.chainId],
    },
    queryParams: {
      chainId: account.chainId,
    },
  });

  useEffect(() => {
    if (transactions && !isPending) {
      //TODO: just working for ERC20, add support for native tokens
      fetchRefunds(
        transactions.transactions,
        config,
        chain,
        account.address
      ).then(setRefunds);
    }
  }, [transactions, isPending, config, chain, account]);

  if (isPending) {
    return (
      <List disablePadding>
        {Array.from({ length: 4 }).map((_, index) => (
          <TokenListItemSkeleton key={index} />
        ))}
      </List>
    );
  }

  return (
    <PageContainer bottomGutters>
      {!isPending && (
        <TransactionList
          transactions={transactions.transactions}
          refunds={refunds}
        />
      )}
    </PageContainer>
  );
};
