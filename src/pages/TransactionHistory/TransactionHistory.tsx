import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { useFetch } from "../../hooks/useFetch";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { List, Typography } from "@mui/material";
import { TokenListItemSkeleton } from "../../components/TokenList/TokenListItem";
import { useConfig } from "wagmi";
import { useChain } from "../../hooks/useChain";
import { useToken } from "../../hooks/useToken";
import nativeTokenCatalog from "../../utils/nativeTokenCatalog";
import BandoERC20FulfillableV1 from "@bandohq/contract-abis/abis/BandoERC20FulfillableV1_2.json";
import BandoFulfillableV1 from "@bandohq/contract-abis/abis/BandoFulfillableV1_2.json";
import { readContract } from "wagmi/actions";
import { Box } from "@mui/system";
import { NoTransactionsFound } from "./NoTransactionsFound";

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
  const [refunds, setRefunds] = useState<{ id: string; txStatus: number }[]>(
    []
  );
  const { searchToken, isLoading: isLoadingToken } = useToken(chain);

  const {
    data: transactions,
    isPending,
    error,
  } = useFetch({
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
    if (transactions && !isPending && !isLoadingToken) {
      const possibleRefunds = transactions.transactions.filter(
        (transaction) => transaction.status === "FAILED"
      );

      if (possibleRefunds.length === 0) {
        return;
      }

      const refundPromises = possibleRefunds.map(async (transaction) => {
        const token = searchToken(transaction.tokenUsed);
        const nativeToken = nativeTokenCatalog.find(
          (item) => item.key === chain?.key
        );

        try {
          if (token.key === nativeToken?.key) {
            const FulfillableRegistryABI = BandoFulfillableV1.abi.find(
              (item) => item.name === "record"
            );
            const txStatus = (await readContract(config, {
              address: chain?.protocolContracts?.BandoFulfillableProxy,
              abi: [FulfillableRegistryABI],
              functionName: "record",
              args: [transaction.recordId],
              chainId: chain?.chainId,
            })) as { status: number };
            return { id: transaction.id, txStatus: txStatus.status as number };
          } else {
            const FulfillableRegistryABI = BandoERC20FulfillableV1.abi.find(
              (item) => item.name === "record"
            );
            const txStatus = (await readContract(config, {
              address: chain?.protocolContracts?.BandoERC20FulfillableProxy,
              abi: [FulfillableRegistryABI],
              functionName: "record",
              args: [transaction.recordId],
              chainId: chain?.chainId,
            })) as { status: number };
            return { id: transaction.id, txStatus: txStatus.status as number };
          }
        } catch (error) {
          console.error(error);
          return {
            id: transaction.id,
            txStatus: -1,
          };
        }
      });

      Promise.all(refundPromises).then(setRefunds);
    }
  }, [transactions, isPending, config, chain, account, isLoadingToken]);

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
            refunds={refunds}
          />
        )}
      </Box>
    </PageContainer>
  );
};
