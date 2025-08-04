import { PageContainer } from "../../components/PageContainer";
import { useFetch } from "../../hooks/useFetch";
import { ErrorView } from "./ErrorView";
import { StatusPageContainer } from "./StatusPage.style";
import { SuccessView } from "./SuccessView";
import { useParams, useSearchParams } from "react-router-dom";
import { useAccount } from "@lifi/wallet-management";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { useEffect } from "react";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useFieldActions } from "../../stores/form/useFieldActions";
import { useQuotes } from "../../providers/QuotesProvider/QuotesProvider";
import { useNotificationContext } from "../../providers/AlertProvider/NotificationProvider";
import { useTranslation } from "react-i18next";

export const StatusPage = () => {
  const { transactionId } = useParams();
  const [errorState] = useSearchParams();
  const { account } = useAccount();
  const { integrator } = useWidgetConfig();
  const { resetProduct } = useProduct();
  const { setFieldValue } = useFieldActions();
  const { resetQuote } = useQuotes();
  const { showNotification } = useNotificationContext();
  const { t } = useTranslation();

  // Check if it's the new flow (pending)
  const isNewFlow = transactionId === "pending";

  const { data: transactionData, error } = useFetch({
    url:
      transactionId && account?.address && !isNewFlow
        ? `wallets/${account?.address}/transactions/${transactionId}/`
        : "",
    method: "GET",
    queryParams: {
      integrator,
    },
    queryOptions: {
      queryKey: ["transaction", transactionId, account?.address],
      refetchInterval: 10000,
      enabled: !!(transactionId && account?.address && !isNewFlow),
    },
  });

  useEffect(() => {
    if (error) {
      showNotification("error", t("error.message.errorProcessingPurchase"));
    }
  }, [error]);

  const renderStatusView = () => {
    if (isNewFlow) {
      return <SuccessView status={null} />;
    }

    if (error) {
      return <ErrorView isErrorLoading={true} />;
    }

    if (errorState.get("error") === "true") {
      return <ErrorView />;
    }

    switch (transactionData?.status) {
      case "FAILED":
        return <ErrorView isErrorLoading={false} />;
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
