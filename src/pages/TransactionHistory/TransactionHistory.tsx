import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { useFetch } from "../../hooks/useFetch";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { List } from "@mui/material";
import { TokenListItemSkeleton } from "../../components/TokenList/TokenListItem";
import { Box } from "@mui/system";
import { NoTransactionsFound } from "./NoTransactionsFound";
import { useWorld } from "../../hooks/useWorld.js";

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
  useHeader(t("history.title"));
  const { account } = useAccount();
  const { isWorld, provider } = useWorld();

  const userAddress = isWorld
    ? provider?.user?.walletAddress
    : account?.address;
  const chainId = isWorld ? 480 : account?.chainId;

  const {
    data: transactions,
    isPending,
    error,
  } = useFetch({
    url: userAddress ? `wallets/${userAddress}/transactions` : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transactions", userAddress, chainId],
    },
    queryParams: {
      chainId,
    },
  });

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
    <PageContainer>
      <Box>
        {error && !transactions?.transactions?.length && !isPending && (
          <NoTransactionsFound />
        )}
        {!isPending && transactions && (
          <TransactionList
            transactions={transactions.transactions}
            refunds={undefined}
          />
        )}
      </Box>
    </PageContainer>
  );
};
