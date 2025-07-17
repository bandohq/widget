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
import { useCallback, useEffect } from 'react';
import { useAccount, useWalletMenu } from "@lifi/wallet-management";
import { Avatar, Skeleton } from '@mui/material';
import { CaretDown } from '@phosphor-icons/react';
import { useQuotes } from '../../providers/QuotesProvider/QuotesProvider.js';
import { Box } from '@mui/material';
import { WidgetEvent, InsufficientBalance } from "../../types/events.js";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";
import { formatTotalAmount } from '../../utils/format.js';
import { useFlags } from "launchdarkly-react-client-sdk";
import { useWorld } from "../../hooks/useWorld.js";

export const SelectTokenButtonForProducts: React.FC<
  FormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact, readOnly }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { transactionFlow } = useFlags();
  const { product } = useProduct();
  const emitter = useWidgetEvents();
  const {
    quote,
    isPending: quotePending,
    fetchQuote,
    isPurchasePossible,
  } = useQuotes();
  const { account } = useAccount();
  const { openWalletMenu } = useWalletMenu();
  const { walletConfig } = useWidgetConfig();
  const tokenKey = FormKeyHelper.getTokenKey(formType);
  const [tokenAddress] = useFieldValues(tokenKey);
  const { chain } = useChain(account?.chainId);
  const { token } = useToken(chain, tokenAddress);
  const { isWorld } = useWorld();

  useEffect(() => {
    if (product?.sku && product?.price?.fiatCurrency && token?.symbol) {
      fetchQuote(
        product.sku,
        product.price.fiatCurrency,
        token.address,
        transactionFlow
      );
    }
  }, [
    product?.sku,
    product?.price?.fiatCurrency,
    token?.symbol,
    transactionFlow,
  ]);

  const handleClick = () => {
    if (readOnly) return;
    navigate(navigationRoutes.fromToken);
  };

  const handleConnect = () => {
    if (account.isConnected || isWorld) {
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
  const defaultPlaceholder = !account.isConnected
    ? t("button.connectWallet")
    : product && !quote && t("main.selectToken");
  const cardTitle: string = t(`main.totalToPay`);

  useEffect(() => {
    renderWarning();
  }, [quote?.totalAmount, isPurchasePossible, account?.chainId, tokenAddress]);

  return (
    <SelectTokenCard
      component="button"
      onClick={account?.isConnected && product ? handleClick : handleConnect}
    >
      <CardContent formType={formType} compact={compact}>
        <CardTitle>{cardTitle}</CardTitle>
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
            title={defaultPlaceholder}
            compact={compact}
          />
        ) : (
          <SelectTokenCardHeader
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
      {quote?.totalAmount && !isPurchasePossible && (
        <Box
          sx={{
            color: "red",
            display: "flex",
            justifyContent: "center",
            padding: "5px",
            textAlign: "right",
          }}
        >
          {t("warning.message.insufficientFunds")}
        </Box>
      )}
    </SelectTokenCard>
  );
};
