import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain } from '../../hooks/useChain.js';
import { useToken } from '../../hooks/useToken';
import type { FormTypeProps } from '../../stores/form/types.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { AvatarBadgedDefault, AvatarBadgedSkeleton } from '../Avatar/Avatar';
import { CardTitle } from '../Card/CardTitle';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import {
  CardContent,
  SelectTokenCard,
  SelectTokenCardHeader,
} from './SelectTokenButton.style.js';
import { useProduct } from '../../stores/ProductProvider/ProductProvider.js';
import { useEffect } from "react";
import { useAccount, useWalletMenu } from "@lifi/wallet-management";
import { Alert, Avatar, Skeleton, Collapse, SxProps, Theme } from "@mui/material";
import { CaretDown } from "@phosphor-icons/react";
import { useQuotes } from "../../providers/QuotesProvider/QuotesProvider.js";
import { WidgetEvent, InsufficientBalance } from "../../types/events.js";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";
import { formatTotalAmount } from "../../utils/format.js";
import { useWorld } from "../../hooks/useWorld.js";

export const SelectTokenButtonForProducts: React.FC<
  FormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact, readOnly }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { product } = useProduct();
  const emitter = useWidgetEvents();
  const {
    quote,
    isPending: quotePending,
    fetchQuote,
    isPurchasePossible,
    error: quoteError,
  } = useQuotes();
  const { account } = useAccount();
  const { openWalletMenu } = useWalletMenu();
  const { walletConfig } = useWidgetConfig();
  const tokenKey = FormKeyHelper.getTokenKey(formType);
  const [tokenAddress] = useFieldValues(tokenKey);
  const { isWorld } = useWorld();
  const { chain } = useChain(isWorld ? 480 : account?.chainId);
  const { token } = useToken(chain, tokenAddress);
  const { theme } = useWidgetConfig();
  useEffect(() => {
    if (product?.sku && product?.price?.fiatCurrency && token?.symbol) {
      fetchQuote(product.sku, product.price.fiatCurrency, token.address);
    }
  }, [product?.sku, product?.price?.fiatCurrency, token?.symbol]);

  const handleClick = () => {
    if (readOnly) return;
    navigate(navigationRoutes.fromToken);
  };

  const handleConnect = () => {
    if (account.isConnected) {
      handleClick();
    } else if (walletConfig?.onConnect) {
      walletConfig.onConnect();
    } else {
      openWalletMenu();
    }
  };

  const renderWarning = () => {
    if (quote?.totalAmount && !isPurchasePossible) {
      emitter.emit(WidgetEvent.InsufficientBalance, {
        chainId: account?.chainId,
        tokenAddress: tokenAddress,
      } as InsufficientBalance);
    }
  };

  const isSelected = !!(chain && token);

  const defaultPlaceholder = () => {
    // world case - no quote
    if (!account.isConnected && isWorld && product && !quote) {
      return t("main.selectToken");
    }
    // non-world case - no quote - no account connected
    if (!account.isConnected && !isWorld && product && !quote) {
      return t("button.connectWallet");
    }
    // non-world case - no quote - account connected
    if (account.isConnected && !isWorld && product && !quote) {
      return t("main.selectToken");
    }
    return t("main.selectToken");
  };

  const cardTitle: string = t(`main.totalToPay`);

  useEffect(() => {
    renderWarning();
  }, [quote?.totalAmount, isPurchasePossible, account?.chainId, tokenAddress]);

  const rootInputStyles = theme?.components?.MuiInput?.styleOverrides?.root;
  return (
    <>
      <CardTitle sx={{ padding: "0", margin: "5px" }}>{cardTitle}</CardTitle>
      <SelectTokenCard
        sx={rootInputStyles as SxProps<Theme>}
        component="button"
        onClick={
          (account?.isConnected || isWorld) && product
            ? handleClick
            : handleConnect
        }
      >
        <CardContent formType={formType} compact={compact}>
          {!token && !product && !quote ? (
            <SelectTokenCardHeader
              avatar={<AvatarBadgedSkeleton />}
              title="0"
              subheader="0 USD"
              compact={compact}
            />
          ) : product && quotePending ? (
            <SelectTokenCardHeader
              avatar={
                <>
                  <Avatar src={token.imageUrl} alt={token.symbol}>
                    {token.symbol?.[0]}
                  </Avatar>
                  <CaretDown
                    size={"25px"}
                    style={{ margin: "auto", paddingLeft: 5 }}
                  />
                </>
              }
              title={<Skeleton />}
              titleTypographyProps={{
                title: token.symbol,
              }}
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
          ) : (product && !quote) || !token ? (
            <SelectTokenCardHeader
              avatar={<AvatarBadgedDefault />}
              title={defaultPlaceholder()}
              compact={compact}
            />
          ) : (
            <SelectTokenCardHeader
              className="quote-requested"
              avatar={
                isSelected ? (
                  <>
                    <Avatar src={token.imageUrl} alt={token.symbol}>
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
              title={`${formatTotalAmount(quote, token)} ${token?.symbol}`}
              titleTypographyProps={{
                title: token.symbol,
              }}
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
      <Collapse in={quoteError && !isPurchasePossible} timeout={300}>
        <Alert sx={{ marginTop: 2 }} severity="error">
          {t("warning.message.insufficientFunds")}
        </Alert>
      </Collapse>
    </>
  );
};
