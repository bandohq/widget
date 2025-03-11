import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useAccount } from "@lifi/wallet-management";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import {
  Button,
  List,
  Paper,
  Typography,
  ListItem,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { Barcode } from "@phosphor-icons/react";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";

export const TransactionsDetailPage = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { transactionId } = useParams();
  const { availableCountries } = useCountryContext();

  useHeader(t("history.detailTitle"));

  const { data: transactionData } = useFetch({
    url: transactionId ? `transactions/${transactionId}/` : "",
    method: "GET",
    queryOptions: {
      queryKey: ["transaction", transactionId],
    },
  });

  //TODO: query transaction refound
  // if necesary, render refound button

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
      {/* TODO: truncate id */}
      <Typography variant="body2" align="center" mt={2}>
        Transaction ID: {transactionData?.transactionId}
      </Typography>

      <List>
        <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" align="left">
            Date:
          </Typography>
          <Typography variant="body2" align="right">
            {transactionData?.created}
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
      <BottomSheet open>
        <Paper sx={{ padding: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            Refound
          </Button>
        </Paper>
      </BottomSheet>
    </PageContainer>
  );
};
