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
import BandoERC20FulfillableV1 from "@bandohq/contract-abis/abis/BandoERC20FulfillableV1.json";
import { useConfig } from "wagmi";
import nativeTokenCatalog from "../../utils/nativeTokenCatalog";
import { transformToChainConfig } from "../../utils/TransformToChainConfig";
import { useToken } from "../../hooks/useToken";
import { useState } from "react";
import { useNotificationContext } from "../../providers/AlertProvider/NotificationProvider";

export const TransactionsDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { account } = useAccount();
  const { chain } = useChain(account.chainId);
  const config = useConfig();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const tokenUsed = searchParams.get("tokenUsed");
  const amount = BigInt(searchParams.get("amount"));
  const { transactionId } = useParams();
  const { showNotification } = useNotificationContext();
  const { availableCountries } = useCountryContext();
  const { token } = useToken(chain, tokenUsed);
  const [loading, setLoading] = useState(false);

  useHeader(t("history.detailTitle"));

  const { data: transactionData } = useFetch({
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
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleRefund = async () => {
    setLoading(true);
    const FulfillableRegistryABI = BandoERC20FulfillableV1.abi.find(
      (item) => item.name === "withdrawERC20Refund"
    );
    const nativeToken = nativeTokenCatalog.find(
      (item) => item.key === chain?.key
    );
    const formattedChain = defineChain(
      transformToChainConfig(chain, nativeToken)
    );
    if (serviceId && amount) {
      try {
        await writeContract(config, {
          address: chain?.protocolContracts?.BandoERC20FulfillableProxy,
          abi: [FulfillableRegistryABI],
          functionName: "withdrawERC20Refund",
          args: [serviceId, transactionData.tokenUsed, account.address],
          chain: formattedChain,
          account: account?.address as `0x${string}`,
        });

        setLoading(false);
        showNotification("success", "Refund sent successfully");
      } catch (error) {
        setLoading(false);
        showNotification("error", "Error on refunding tokens, try later");
        console.error("Error on refunding tokens:", error);
      }
    }
  };

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

      {/* Refound section */}
      <BottomSheet open={openRefundSheet()}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="body1" align="center" mb={2}>
            You have {Number(amount) / Math.pow(10, token.decimals)}
            {token.symbol} to refound
          </Typography>
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            onClick={handleRefund}
            sx={{ width: "100%", borderRadius: 2 }}
          >
            Refound
          </Button>
        </Paper>
      </BottomSheet>
    </PageContainer>
  );
};

