import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { List, Typography, ListItem, Divider, Box, Chip } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { Barcode } from "@phosphor-icons/react";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useTheme } from "@mui/system";

export const TransactionsDetailPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { account } = useAccount();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const { transactionId } = useParams();
  const { availableCountries } = useCountryContext();

  useHeader(t("history.detailTitle"));

  const { data: transactionData, isPending } = useFetch({
    url:
      transactionId && account?.address
        ? `wallets/${account?.address}/transactions/${transactionId}/`
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
    </PageContainer>
  );
};
