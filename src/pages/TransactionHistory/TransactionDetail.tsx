import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { Button, Paper } from "@mui/material";

export const TransactionsDetailPage = () => {
  const { t } = useTranslation();
  useHeader(t("history.detailTitle"));
  const { account } = useAccount();

  //TODO: query transaction detail

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
