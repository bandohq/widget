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
import { AvatarBadgedDefault, AvatarBadgedSkeleton } from "../Avatar/Avatar";
import { TokenAvatar } from "../Avatar/TokenAvatar";
import { CardTitle } from "../Card/CardTitle";
import {
  CardContent,
  SelectTokenCard,
  SelectTokenCardHeader,
} from "./SelectTokenButton.style.js";
import { useProduct } from "../../stores/ProductProvider/ProductProvider.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useEffect } from "react";

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
  const { token, isLoading: isTokenLoading } = useToken(chain, tokenAddress);
  const {
    data: quote,
    isPending,
    mutate,
  } = useFetch({
    url: "quotes",
    method: "POST",
    data: {
      sku: product?.sku,
      fiat_currency: product?.price?.fiatCurrency,
      digital_asset: token?.symbol || null,
    },
    queryOptions: {
      queryKey: ["quote", product?.sku, product?.fiatCurrency, token?.symbol],
    },
  });

  useEffect(() => {
    if (!!(product?.sku && product?.price?.fiatCurrency && token?.symbol)) {
      //Triggering fetch for new product/token combination
      mutate();
    }
  }, [product?.sku, product?.price?.fiatCurrency, token?.symbol]);

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
    <SelectTokenCard component="button" onClick={product && onClick}>
      <CardContent formType={formType} compact={compact}>
        <CardTitle>{cardTitle}</CardTitle>
        {!token && !product && !isChainLoading ? (
          <SelectTokenCardHeader
            avatar={<AvatarBadgedSkeleton />}
            title="0"
            subheader="0 USD"
            compact={compact}
          />
        ) : product && !token ? (
          <SelectTokenCardHeader
            avatar={<AvatarBadgedDefault />}
            title={defaultPlaceholder}
            subheader={`${parseFloat(product.price?.fiatValue).toFixed(2)} ${
              product.price?.fiatCurrency
            }`}
            compact={compact}
          />
        ) : (
          <SelectTokenCardHeader
            avatar={
              isSelected ? (
                <TokenAvatar token={token} chain={chain} />
              ) : (
                <AvatarBadgedDefault />
              )
            }
            title={`${quote?.digital_asset_amount} ${quote?.digital_asset}`}
            titleTypographyProps={{
              title: isSelected ? token.symbol : "holiwis",
            }}
            subheader={`${quote?.fiat_amount} ${quote?.fiat_currency}`}
            subheaderTypographyProps={
              isSelected
                ? {
                    title: chain.name,
                  }
                : undefined
            }
            selected={isSelected}
            compact={compact}
          />
        )}
      </CardContent>
    </SelectTokenCard>
  );
};
