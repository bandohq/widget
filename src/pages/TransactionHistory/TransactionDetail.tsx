import { useTranslation } from "react-i18next";
import { writeContract } from "@wagmi/core";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { defineChain } from "viem";
import {
  Button,
  List,
  Paper,
  Typography,
  ListItem,
  Divider,
} from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { Barcode } from "@phosphor-icons/react";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useChain } from "../../hooks/useChain";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import { useConfig } from "wagmi";
import nativeTokenCatalog from "../../utils/nativeTokenCatalog";
import { transformToChainConfig } from "../../utils/TransformToChainConfig";
import { useToken } from "../../hooks/useToken";
import { useEffect, useState } from "react";
import { useNotificationContext } from "../../providers/AlertProvider/NotificationProvider";
import { executeRefund } from "../../utils/refunds";

export const TransactionsDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { account } = useAccount();
  const { chain } = useChain(account.chainId);
  const config = useConfig();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const tokenUsed = searchParams.get("tokenUsed");
  const amount = searchParams.get("amount");
  const { transactionId } = useParams();
  const { showNotification } = useNotificationContext();
  const { availableCountries } = useCountryContext();
  const { token } = useToken(chain, tokenUsed);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useHeader(t("history.detailTitle"));

  const { data: transactionData, isPending } = useFetch({
    url: transactionId ? `transactions/${transactionId}/` : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transaction", transactionId],
    },
  });

  const openRefundSheet = () => {
    if (serviceId && amount) {
      return true;
    }

    return false;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleRefund = async () => {
    setLoading(true);

    const nativeToken = nativeTokenCatalog.find(
      (item) => item.key === chain?.key
    );
    const formattedChain = defineChain(
      transformToChainConfig(chain, nativeToken)
    );

    if (serviceId && amount) {
      try {
        const isNativeToken = nativeToken.key === token.key;

        await executeRefund({
          config,
          chain: formattedChain,
          contractAddress: chain?.protocolContracts?.BandoRouterProxy,
          abiName: isNativeToken ? "withdrawRefund" : "withdrawERC20Refund",
          abi: BandoRouter.abi,
          functionName: isNativeToken
            ? "withdrawRefund"
            : "withdrawERC20Refund",
          args: isNativeToken
            ? [serviceId, account.address]
            : [serviceId, transactionData.tokenUsed, account.address],
          accountAddress: account?.address,
        });

        setLoading(false);
        setOpen(false);
        showNotification("success", "Refund sent successfully");
      } catch (error) {
        setLoading(false);
        setOpen(false);
        showNotification("error", "Error on refunding tokens, try later");
        console.error("Error on refunding tokens:", error);
      }
    }
  };

  useEffect(() => {
    if (serviceId && amount) {
      setOpen(true);
    }
  }, [serviceId, amount]);

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

      <Typography variant="h5" align="center" my={2}>
        {transactionData?.fiatUnitPrice} {transactionData?.fiatCurrency}
      </Typography>
      {/* TODO: truncate id and add copy button */}
      <Typography variant="body2" align="center" mt={2}>
        Transaction ID: {transactionData?.transactionId}
      </Typography>

      <List>
        <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" align="left">
            Date:
          </Typography>
          <Typography variant="body2" align="right">
            {formatDate(transactionData?.created)}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" align="left">
            Country:
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
            Sent to:
          </Typography>
          <Typography variant="body2" align="right">
            {transactionData?.givenReference}
          </Typography>
        </ListItem>
      </List>

      {/* Refund section */}
      {amount && Number(BigInt(amount)) > 0 && (
        <BottomSheet open={open}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="body1" align="center" mb={2}>
              {!amount || !token
                ? "No refund available"
                : `You have ${
                    Number(BigInt(amount)) / Math.pow(10, token.decimals)
                  }
            ${token.symbol} to refund`}
            </Typography>
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

