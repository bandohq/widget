import { useEffect, useState } from "react";
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
import { useConfig } from "wagmi";
import { useChain } from "../../hooks/useChain";
import { useToken } from "../../hooks/useToken";
import BandoERC20FulfillableV1 from "@bandohq/contract-abis/abis/BandoERC20FulfillableV1_2.json";
import BandoFulfillableV1 from "@bandohq/contract-abis/abis/BandoFulfillableV1_2.json";
import { readContract } from "wagmi/actions";
import { useFlags } from "launchdarkly-react-client-sdk";
import { useWorld } from "../../hooks/useWorld";

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
  const { transactionFlow } = useFlags();
  const config = useConfig();
  useHeader(t("history.title"));
  const { account } = useAccount();
  const { chain } = useChain(account.chainId);
  const [refunds, setRefunds] = useState<{ id: string; txStatus: number }[]>(
    []
  );
  const { searchToken, isLoading: isLoadingToken } = useToken(chain);
  const { isWorld, provider } = useWorld();

  const userAddress = isWorld
    ? provider?.user?.walletAddress
    : account?.address;

  const chainId = isWorld ? 480 : account.chainId;

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
      chainId: chainId,
    },
  });

  useEffect(() => {
    if (
      !transactionFlow &&
      transactions &&
      !isPending &&
      !isLoadingToken &&
      refunds.length === 0
    ) {
      const possibleRefunds = transactions.transactions.filter(
        (transaction) => transaction.status === "FAILED"
      );

      if (possibleRefunds.length === 0) return;

      const refundPromises = possibleRefunds.map(async (transaction) => {
        const token = searchToken(transaction.tokenUsed);
        const nativeToken = chain?.nativeToken;

        try {
          const abi =
            token.key === nativeToken?.symbol
              ? BandoFulfillableV1.abi.find((item) => item.name === "record")
              : BandoERC20FulfillableV1.abi.find(
                  (item) => item.name === "record"
                );

          const address =
            token.key === nativeToken?.symbol
              ? chain?.protocolContracts?.BandoFulfillableProxy
              : chain?.protocolContracts?.BandoERC20FulfillableProxy;

          const txStatus = (await readContract(config, {
            address,
            abi: [abi],
            functionName: "record",
            args: [transaction.recordId],
            chainId: chain?.chainId,
          })) as { status: number };

          return { id: transaction.id, txStatus: txStatus.status };
        } catch (error) {
          console.error(error);
          return { id: transaction.id, txStatus: -1 };
        }
      });

      Promise.all(refundPromises).then(setRefunds);
    }
  }, [
    transactionFlow,
    transactions,
    isPending,
    config,
    chain,
    account,
    isLoadingToken,
  ]);

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
            refunds={transactionFlow ? undefined : refunds}
          />
        )}
      </Box>
    </PageContainer>
  );
};
