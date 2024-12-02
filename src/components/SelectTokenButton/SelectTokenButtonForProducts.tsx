import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useChain } from "../../hooks/useChain.js";
import { useSwapOnly } from "../../hooks/useSwapOnly";
import { useToken } from "../../hooks/useToken";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";
import type { FormTypeProps } from "../../stores/form/types.js";
import { FormKeyHelper } from "../../stores/form/types.js";
import { useFieldValues } from "../../stores/form/useFieldValues.js";
import { navigationRoutes } from "../../utils/navigationRoutes.js";
import { AvatarBadgedSkeleton } from "../Avatar/Avatar";
import { TokenAvatar } from "../Avatar/TokenAvatar";
import { CardTitle } from "../Card/CardTitle";
import {
  CardContent,
  SelectTokenCard,
  SelectTokenCardHeader,
} from "./SelectTokenButton.style.js";
import { useProduct } from "../../stores/ProductProvider/ProductProvider.js";

export const SelectTokenButtonForProducts: React.FC<
  FormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI, subvariant } = useWidgetConfig();
  const { product } = useProduct();
  const swapOnly = useSwapOnly();
  const tokenKey = FormKeyHelper.getTokenKey(formType);
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    tokenKey
  );
  const { chain, isLoading: isChainLoading } = useChain(chainId);
  const { token, isLoading: isTokenLoading } = useToken(chainId, tokenAddress);

  const handleClick = () => {
    navigate(formType === "from" && navigationRoutes.fromToken);
  };

  const isSelected = !!(chain && token);
  const onClick = !disabledUI?.includes(tokenKey) ? handleClick : undefined;
  const defaultPlaceholder =
    formType === "to" && subvariant === "refuel"
      ? t("main.selectChain")
      : formType === "to" && swapOnly
      ? t("main.selectToken")
      : t("main.selectChainAndToken");
  const cardTitle: string =
    formType === "from" && subvariant === "custom"
      ? t("header.payWith")
      : t(`main.${formType}`);

  return (
    <SelectTokenCard component="button" onClick={onClick}>
      <CardContent formType={formType} compact={compact}>
        <CardTitle>{cardTitle}</CardTitle>
        {!product ? (
          <SelectTokenCardHeader
            avatar={<AvatarBadgedSkeleton />}
            title="0"
            subheader="0 USD"
            compact={compact}
          />
        ) : (
          <SelectTokenCardHeader
            avatar={<TokenAvatar token={product.token} chain={product.chain} />}
            title={`${parseFloat(product.price.stableCoinValue).toFixed(2)} ${
              product.price.stableCoinCurrency
            }`}
            subheader={`${parseFloat(product.price.fiatValue).toFixed(2)} ${
              product.price.fiatCurrency
            }`}
            compact={compact}
          />
        )}
      </CardContent>
    </SelectTokenCard>
  );
};
