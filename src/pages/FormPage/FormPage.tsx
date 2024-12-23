import { Box } from "@mui/material";
import { PageContainer } from "../../components/PageContainer";
import { PoweredBy } from "../../components/PoweredBy/PoweredBy";
import { SelectChainAndToken } from "../../components/SelectChainAndToken";
import { useHeader } from "../../hooks/useHeader";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../../types/widget";
import { ReviewButton } from "./ReviewButton";
import { useTranslation } from "react-i18next";
import { SelectProductButton } from "../../components/SelectProductButton/SelectProductButton";
import { QuantityInput } from "../../components/QuantityInput/QuantityInput";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { DetailSection } from "./DetailSection";

export const FormPage: React.FC = () => {
  const { hiddenUI } = useWidgetConfig();
  const { t } = useTranslation();
  const { product } = useProduct();
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);

  useHeader(t("header.title"));

  return (
    <PageContainer>
      <SelectProductButton formType="from" compact />
      {product?.productType === "giftCard" && <QuantityInput />}

      <SelectChainAndToken mb={2} />

      {product && (
        <DetailSection
          productType={product?.productType}
          referenceType={product?.referenceType}
        />
      )}

      <Box display="flex" mb={showPoweredBy ? 1 : 3} gap={1.5}>
        <ReviewButton />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  );
};
