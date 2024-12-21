import { PageContainer } from "../../components/PageContainer";
import { PoweredBy } from "../../components/PoweredBy/PoweredBy";
import { useFetch } from "../../hooks/useFetch";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { ErrorView } from "./ErrorView";
import { PendingView } from "./PendingView";
import { StatusPageContainer } from "./StatusPage.style";
import { SuccessView } from "./SuccessView";
import { useParams } from "react-router-dom";

export const StatusPage = () => {
  const { hiddenUI } = useWidgetConfig();
  const { transactionId } = useParams();

  const { data: transactionData } = useFetch({
    url: transactionId ? `/transaction/${transactionId}` : "",
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

  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);

  return (
    <PageContainer>
      <StatusPageContainer>{renderStatusView()}</StatusPageContainer>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  );
};
