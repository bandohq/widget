import { PageContainer } from "../../components/PageContainer";
import { useFetch } from "../../hooks/useFetch";
import { ErrorView } from "./ErrorView";
import { StatusPageContainer } from "./StatusPage.style";
import { SuccessView } from "./SuccessView";
import { useParams } from "react-router-dom";
import { useAccount } from "@lifi/wallet-management";

export const StatusPage = () => {
  const { transactionId } = useParams();
  const { account } = useAccount();

  const { data: transactionData } = useFetch({
    url:
      transactionId && account?.address
        ? `wallets/${account?.address}/transactions/${transactionId}/`
        : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transaction", transactionId, account?.address],
      refetchInterval: 10000,
    },
  });

  const renderStatusView = () => {
    switch (transactionData?.status) {
      case "FAILED":
        return <ErrorView transaction={transactionData} />;
      default:
        return <SuccessView status={transactionData} />;
    }
  };

  return (
    <PageContainer>
      <StatusPageContainer>{renderStatusView()}</StatusPageContainer>
    </PageContainer>
  );
};
