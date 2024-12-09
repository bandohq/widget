import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useChain } from "../../hooks/useChain.js";
import { useToken } from "../../hooks/useToken";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";
import type { FormTypeProps } from "../../stores/form/types.js";
import { FormKeyHelper } from "../../stores/form/types.js";
import { useFieldValues } from "../../stores/form/useFieldValues.js";
import { navigationRoutes } from "../../utils/navigationRoutes.js";
import { AvatarBadgedDefault, AvatarBadgedSkeleton } from "../Avatar/Avatar";
import { CardTitle } from "../Card/CardTitle";
import {
  CardContent,
  SelectTokenCard,
  SelectTokenCardHeader,
} from "./SelectTokenButton.style.js";
import { useProduct } from "../../stores/ProductProvider/ProductProvider.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useEffect } from "react";
import { useAccount } from "@lifi/wallet-management";
import { Avatar } from "@mui/material";

export const SelectTokenButtonForProducts: React.FC<
  FormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI } = useWidgetConfig();
  const { product } = useProduct();
  const tokenKey = FormKeyHelper.getTokenKey(formType);
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    tokenKey
  );
  const { chain } = useChain(chainId);
  const { token } = useToken(chain, tokenAddress);
  const { account } = useAccount({
    chainType: chain?.network_type,
  });
  const { data: quote, mutate } = useFetch({
    url: "quotes/",
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
    navigate(navigationRoutes.fromToken);
  };

  const isSelected = !!(chain && token);
  const onClick = !disabledUI?.includes(tokenKey) ? handleClick : undefined;
  const defaultPlaceholder = t("main.selectChainAndToken");
  const cardTitle: string = t(`main.${formType}`);

  return (
    <SelectTokenCard
      component="button"
      onClick={account?.isConnected && product ? onClick : undefined}
    >
      <CardContent formType={formType} compact={compact}>
        <CardTitle>{cardTitle}</CardTitle>
        {!token && !product ? (
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
                <Avatar src={token.image_url} alt={token.symbol}>
                  {token.symbol?.[0]}
                </Avatar>
              ) : (
                <AvatarBadgedDefault />
              )
            }
            title={`${quote?.digital_asset_amount} ${quote?.digital_asset}`}
            titleTypographyProps={{
              title: token.symbol,
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
