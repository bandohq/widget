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
import { useToken } from "../../hooks/useToken";
import nativeTokenCatalog from "../../utils/nativeTokenCatalog";
import BandoERC20FulfillableV1 from "@bandohq/contract-abis/abis/BandoERC20FulfillableV1.json";
import BandoFulfillableV1 from "@bandohq/contract-abis/abis/BandoFulfillableV1.json";
import { readContract } from "wagmi/actions";

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
  const { searchToken, isLoading: isLoadingToken } = useToken(chain);

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

        if (token.key === nativeToken?.key) {
          const FulfillableRegistryABI = BandoFulfillableV1.abi.find(
            (item) => item.name === "getRefundsFor"
          );
          const refundAmount = await readContract(config, {
            address: chain?.protocolContracts?.BandoFulfillableProxy,
            abi: [FulfillableRegistryABI],
            functionName: "getRefundsFor",
            args: [transaction.serviceId],
            chainId: chain?.chainId,
          });
          return { id: transaction.id, amount: refundAmount as BigInt };
        } else {
          const FulfillableRegistryABI = BandoERC20FulfillableV1.abi.find(
            (item) => item.name === "getERC20RefundsFor"
          );
          const refundAmount = await readContract(config, {
            address: chain?.protocolContracts?.BandoERC20FulfillableProxy,
            abi: [FulfillableRegistryABI],
            functionName: "getERC20RefundsFor",
            args: [
              transaction.tokenUsed,
              account.address,
              transaction.serviceId,
            ],
            chainId: chain?.chainId,
          });
          return { id: transaction.id, amount: refundAmount as BigInt };
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
