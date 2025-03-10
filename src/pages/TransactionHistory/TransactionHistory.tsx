import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { useFetch } from "../../hooks/useFetch";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { List } from "@mui/material";
import { TokenListItemSkeleton } from "../../components/TokenList/TokenListItem";

export type TransactionStatus = "PROCESSING" | "FAILED" | "SUCCESS" | "COMPLETED";

export interface Transaction {
    id: string;
    status: TransactionStatus;
    price: {
        fiatValue: string;
        fiatCurrency: string;
    }
    productType: string;
    chainId: number;
    brandName: string;
    created: string;
};

export const TransactionsHistoryPage = () => {
  const { t } = useTranslation();
  useHeader(t("history.title"));
  const { account } = useAccount();

  const { data: transactions, isPending, error } = useFetch({
    url: account.address ? `wallets/${account.address}/transactions` : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transactions", account.address, account.chainId],
      refetchInterval: 10000,
    },
    queryParams: {
      chainId: account.chainId
    }
  })

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
        <TransactionList transactions={transactions.transactions} />
      )}
    </PageContainer>
  );
};
