import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { useFetch } from "../../hooks/useFetch";

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
  })

  console.log({ transactions, isPending, error })
  return (
    <PageContainer bottomGutters>
      <h1>transactions</h1>
    </PageContainer>
  );
};
