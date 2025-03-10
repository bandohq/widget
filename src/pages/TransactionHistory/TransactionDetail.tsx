import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { Button, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";

export const TransactionsDetailPage = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { transactionId } = useParams();

  useHeader(t("history.detailTitle"));

  const { data: transactionData } = useFetch({
    url: transactionId ? `transactions/${transactionId}/` : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transaction", transactionId],
    },
  });

  console.log(transactionData);

  //TODO: query transaction refound
  // if necesary, render refound button

  return (
    <PageContainer bottomGutters>
      <BottomSheet open>
        <Paper sx={{ padding: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            Refound
          </Button>
        </Paper>
      </BottomSheet>
    </PageContainer>
  );
};
