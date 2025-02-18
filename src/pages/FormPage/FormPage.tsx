import { Box } from "@mui/material";
import { PageContainer } from "../../components/PageContainer";
import { SelectChainAndToken } from "../../components/SelectChainAndToken";
import { useHeader } from "../../hooks/useHeader";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { ReviewButton } from "./ReviewButton";
import { useTranslation } from "react-i18next";
import { SelectProductButton } from "../../components/SelectProductButton/SelectProductButton";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { DetailSection } from "./DetailSection";
import { useSteps } from "../../providers/StepsProvider/StepsProvider";

export const FormPage: React.FC = () => {
  const { hiddenUI } = useWidgetConfig();
  const { t } = useTranslation();
  const { product } = useProduct();
  const { steps } = useSteps();
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);

  useHeader(t("header.title"));

  return (
    <PageContainer>
      <SelectProductButton
        formType="from"
        compact
        readonly={steps.length > 0}
      />
      <SelectChainAndToken mb={2} readonly={Boolean(steps?.length > 0)} />
      {product && (
        <DetailSection
          productType={product?.productType}
          referenceType={product?.referenceType}
          requiredFields={product?.requiredFields}
        />
      )}

      <Box display="flex" mb={showPoweredBy ? 1 : 3} gap={1.5}>
        <ReviewButton
          referenceType={product?.referenceType}
          requiredFields={product?.requiredFields}
        />
      </Box>
    </PageContainer>
  );
};
