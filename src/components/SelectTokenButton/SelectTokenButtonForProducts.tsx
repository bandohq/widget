import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useChain } from "../../hooks/useChain.js";
import { useToken } from "../../hooks/useToken";
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
import { useEffect } from "react";
import { useAccount } from "@lifi/wallet-management";
import { Avatar, Skeleton } from "@mui/material";
import { CaretDown } from "@phosphor-icons/react";
import { useQuotes } from "../../providers/QuotesProvider/QuotesProvider.js";

export const SelectTokenButtonForProducts: React.FC<
  FormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { product } = useProduct();
  const { quote, isPending: quotePending, fetchQuote } = useQuotes();

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

  useEffect(() => {
    if (product?.sku && product?.price?.fiatCurrency && token?.symbol) {
      fetchQuote(product.sku, product.price.fiatCurrency, token.address);
    }
  }, [product?.sku, product?.price?.fiatCurrency, token?.symbol]);

  const handleClick = () => {
    navigate(navigationRoutes.fromToken);
  };

  const isSelected = !!(chain && token);
  const defaultPlaceholder = !account.isConnected
    ? t("button.connectWallet")
    : product && !token && t("main.selectChainAndToken");
  const cardTitle: string = t(`main.${formType}`);

  return (
    <SelectTokenCard
      component="button"
      onClick={account?.isConnected && product ? handleClick : undefined}
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
            subheader={`${parseFloat(product.price?.fiatValue)} ${
              product.price?.fiatCurrency
            }`}
            compact={compact}
          />
        ) : product && token && quotePending ? (
          <SelectTokenCardHeader
            avatar={
              <>
                <Avatar src={token.image_url} alt={token.symbol}>
                  {token.symbol?.[0]}
                </Avatar>
                <CaretDown
                  size={"25px"}
                  style={{ margin: "auto", paddingLeft: 5 }}
                />
              </>
            }
            title={<Skeleton width={100} />}
            titleTypographyProps={{
              title: token.symbol,
            }}
            subheader={<Skeleton width={80} />}
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
        ) : (
          <SelectTokenCardHeader
            avatar={
              isSelected ? (
                <>
                  <Avatar src={token.image_url} alt={token.symbol}>
                    {token.symbol?.[0]}
                  </Avatar>
                  <CaretDown
                    size={"25px"}
                    style={{ margin: "auto", paddingLeft: 5 }}
                  />
                </>
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
