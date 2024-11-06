import { Box } from "@mui/material";
import { ActiveTransactions } from "../../components/ActiveTransactions/ActiveTransactions";
import { AmountInput } from "../../components/AmountInput/AmountInput";
import { ContractComponent } from "../../components/ContractComponent/ContractComponent";
import { PageContainer } from "../../components/PageContainer";
import { PoweredBy } from "../../components/PoweredBy/PoweredBy";
import { SelectChainAndToken } from "../../components/SelectChainAndToken";
import { useHeader } from "../../hooks/useHeader";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { ReviewButton } from "./ReviewButton";
import { useTranslation } from "react-i18next";

export const MainPage: React.FC = () => {
  const { subvariant, contractComponent, hiddenUI } = useWidgetConfig();
  const { t } = useTranslation();
  const custom = subvariant === "custom";
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);

  useHeader(t("header.title"));

  return (
    <PageContainer>
      <ActiveTransactions sx={{ marginBottom: 2 }} />
      {custom ? (
        <ContractComponent sx={{ marginBottom: 2 }}>
          {contractComponent}
        </ContractComponent>
      ) : null}
      <SelectChainAndToken mb={2} />
      {!custom ? (
        <AmountInput formType="from" sx={{ marginBottom: 2 }} />
      ) : null}
      <Box display="flex" mb={showPoweredBy ? 1 : 3} gap={1.5}>
        <ReviewButton />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  );
};
