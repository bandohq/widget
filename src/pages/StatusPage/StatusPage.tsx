import { PageContainer } from "../../components/PageContainer";
import { useFetch } from "../../hooks/useFetch";
import { ErrorView } from "./ErrorView";
import { PendingView } from "./PendingView";
import { StatusPageContainer } from "./StatusPage.style";
import { SuccessView } from "./SuccessView";
import { useParams } from "react-router-dom";

export const StatusPage = () => {
  const { transactionId } = useParams();

  const { data: transactionData } = useFetch({
    url: transactionId ? `transactions/${transactionId}/` : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transaction", transactionId],
      refetchInterval: 200000,
    },
  });

  const renderStatusView = () => {
    switch (transactionData?.status) {
      case "PENDING":
        return <PendingView />;
      case "FAILED":
        return <ErrorView />;
      case "COMPLETED":
        return <SuccessView />;
      default:
        return <PendingView />;
    }
  };

  return (
    <PageContainer>
      <StatusPageContainer>{renderStatusView()}</StatusPageContainer>
    </PageContainer>
  );
};
