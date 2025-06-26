import { PageContainer } from "../../components/PageContainer";
import { useFetch } from "../../hooks/useFetch";
import { ErrorView } from "./ErrorView";
import { StatusPageContainer } from "./StatusPage.style";
import { SuccessView } from "./SuccessView";
import { useParams } from "react-router-dom";
import { useAccount } from "@lifi/wallet-management";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { useEffect } from "react";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useFieldActions } from "../../stores/form/useFieldActions";
import { useQuotes } from "../../providers/QuotesProvider/QuotesProvider";

export const StatusPage = () => {
  const { transactionId } = useParams();
  const { account } = useAccount();
  const { integrator } = useWidgetConfig();
  const { resetProduct } = useProduct();
  const { setFieldValue } = useFieldActions();
  const { resetQuote } = useQuotes();

  const { data: transactionData } = useFetch({
    url:
      transactionId && account?.address
        ? `wallets/${account?.address}/transactions/${transactionId}/`
        : "",
    method: "GET",
    queryParams: {
      integrator,
    },
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

  useEffect(() => {
    if (transactionData?.status === "COMPLETED") {
      resetProduct();
      setFieldValue("fromToken", "");
      resetQuote();
    }
  }, [transactionData?.status]);

  return (
    <PageContainer>
      <StatusPageContainer>{renderStatusView()}</StatusPageContainer>
    </PageContainer>
  );
};
