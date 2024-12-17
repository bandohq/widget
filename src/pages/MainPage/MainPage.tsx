import { Box } from "@mui/material";
import { ContractComponent } from "../../components/ContractComponent/ContractComponent";
import { PageContainer } from "../../components/PageContainer";
import { PoweredBy } from "../../components/PoweredBy/PoweredBy";
import { SelectChainAndToken } from "../../components/SelectChainAndToken";
import { useHeader } from "../../hooks/useHeader";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { ReviewButton } from "./ReviewButton";
import { useTranslation } from "react-i18next";
import { ProductsPage } from "../ProductsPage/ProductsPage";
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";

export const MainPage: React.FC = () => {
  const { subvariant, contractComponent, hiddenUI } = useWidgetConfig();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const custom = subvariant === "custom";
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);

  useHeader(t("header.title"));

  return (
    <PageContainer>
      {custom ? (
        <ContractComponent sx={{ marginBottom: 2 }}>
          {contractComponent}
        </ContractComponent>
      ) : null}
      <ProductsPage />
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  );
};
