import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import {
  List,
  Typography,
  ListItem,
  Divider,
  Box,
  Chip,
  Paper,
  Button,
} from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { Barcode } from "@phosphor-icons/react";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useTheme } from "@mui/system";
import { useFlags } from "launchdarkly-react-client-sdk";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { useEffect, useState } from "react";
import { useChain } from "../../hooks/useChain";
import { transformToChainConfig } from "../../utils/TransformToChainConfig";
import { executeRefund } from "../../utils/refunds";
import { useConfig } from "wagmi";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1_1.json";
import { defineChain } from "viem";
import { useNotificationContext } from "../../providers/AlertProvider/NotificationProvider";

export const TransactionsDetailPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const config = useConfig();
  const { account } = useAccount();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const serviceId = searchParams.get("serviceId");
  const { transactionId } = useParams();
  const { availableCountries } = useCountryContext();
  const { transactionFlow } = useFlags();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { chain } = useChain(account.chainId);
  const { showNotification } = useNotificationContext();

  useEffect(() => {
    if (!transactionFlow && serviceId && transactionId) {
      setOpen(true);
    }
  }, [transactionFlow, serviceId, transactionId]);

  useHeader(t("history.detailTitle"));

  const { data: transactionData, isPending } = useFetch({
    url: transactionId
      ? transactionFlow
        ? `wallets/${account?.address}/transactions/${transactionId}/`
        : `transactions/${transactionId}/`
      : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transaction", transactionId, account?.address],
    },
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const renderChipLabel = () => {
    return status === "2" ? (
      <div style={{ display: "flex", alignItems: "center" }}>
        Refund available
      </div>
    ) : status === "3" ? (
      <div style={{ display: "flex", alignItems: "center" }}>Refunded</div>
    ) : (
      <div style={{ display: "flex", alignItems: "center" }}>
        {transactionData?.status}
      </div>
    );
  };
  const handleRefund = async () => {
    setLoading(true);

    const nativeToken = chain?.nativeToken;
    const formattedChain = defineChain(
      transformToChainConfig(chain, nativeToken)
    );

    if (serviceId && formattedChain) {
      try {
        const isNativeToken = nativeToken.symbol === transactionData?.token;

        await executeRefund({
          config,
          chain: formattedChain,
          contractAddress: chain?.protocolContracts?.BandoRouterProxy,
          abiName: isNativeToken ? "withdrawRefund" : "withdrawERC20Refund",
          abi: BandoRouter.abi,
          functionName: isNativeToken
            ? "withdrawRefund"
            : "withdrawERC20Refund",
          args: [serviceId, transactionData?.recordId],
          accountAddress: account?.address,
        });

        setLoading(false);
        setOpen(false);
        showNotification("success", t("history.refundSuccess"));
      } catch (error) {
        setLoading(false);
        setOpen(false);
        showNotification("error", t("history.refundError"));
        console.error("Error on refunding tokens:", error);
      }
    }
  };

  if (isPending || !transactionData) {
    return null;
  }

  return (
    <PageContainer bottomGutters>
      {transactionData?.product?.logoUrl ? (
        <ImageAvatar
          hideName
          name={transactionData?.product?.name || ""}
          src={transactionData?.product?.logoUrl}
          sx={{
            maxHeight: "75px",
            objectFit: "contain",
            margin: "auto",
            borderRadius: "10px",
          }}
        />
      ) : (
        <Barcode size={50} />
      )}
      <Typography variant="h4" align="center" mt={2}>
        {transactionData?.product?.name}
      </Typography>

      {status && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Chip
            color="default"
            sx={
              status === "2"
                ? {
                    backgroundColor: theme.palette.primary.main,
                  }
                : transactionData.status === "COMPLETED" ||
                  transactionData.status === "SUCCESS"
                ? {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.getContrastText(
                      theme.palette.primary.light
                    ),
                  }
                : {}
            }
            size="small"
            label={renderChipLabel()}
            onClick={
              !transactionFlow && serviceId && transactionId
                ? () => setOpen(!open)
                : undefined
            }
          />
        </Box>
      )}

      <Typography variant="h5" align="center" my={2}>
        {transactionData?.fiatUnitPrice} {transactionData?.fiatCurrency}
      </Typography>
      <Typography variant="body2" align="center" mt={2}>
        Transaction ID: {transactionData?.transactionId}
      </Typography>

      <List>
        <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" align="left">
            {t("form.delivery.date")}:
          </Typography>
          <Typography variant="body2" align="right">
            {formatDate(transactionData?.created)}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" align="left">
            {t("history.country")}:
          </Typography>
          <Typography variant="body2" align="right">
            {
              availableCountries.find(
                (country) =>
                  country.isoAlpha2 === transactionData?.countryIsoAlpha2
              )?.name
            }
          </Typography>
        </ListItem>
        <Divider />
        <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" align="left">
            {t("history.sentTo")}:
          </Typography>
          <Typography variant="body2" align="right">
            {transactionData?.givenReference}
          </Typography>
        </ListItem>
      </List>
      {!transactionFlow && serviceId && transactionData.tokenAmountPaid && (
        <BottomSheet open={open}>
          <Paper sx={{ padding: 2 }}>
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={handleRefund}
              sx={{ width: "100%", borderRadius: 2 }}
            >
              Refund
            </Button>
          </Paper>
        </BottomSheet>
      )}
    </PageContainer>
  );
};
