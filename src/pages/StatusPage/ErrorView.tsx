import {
  AccordionDetails,
  Alert,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CustomAccordion,
  CustomAccordionSummary,
  IconWrapper,
  StatusSubtitle,
  StatusTitle,
} from "./StatusPage.style";
import { SmileyMelting, CaretDown } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { useFlags } from "launchdarkly-react-client-sdk";

export const ErrorView = ({ transaction }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { transactionFlow } = useFlags();

  //Todo: send direct to refound or main page depending on transactionFlow
  const goTo = () => {
    if (transactionFlow) {
      navigate(navigationRoutes.home);
    } else {
      navigate(navigationRoutes.transactionHistory);
    }
  };

  return (
    <>
      <IconWrapper bgColor="#FAC985">
        <SmileyMelting size={50} />
      </IconWrapper>
      <StatusTitle>{t("error.title.orderFailed")}</StatusTitle>
      <StatusSubtitle>{t("error.title.retry")}</StatusSubtitle>

      <Alert sx={{ mt: 2 }} severity="info">
        {t(
          transactionFlow
            ? "history.instructionsNewFlow"
            : "history.instructions"
        )}
      </Alert>
      <Button
        fullWidth
        sx={{
          mt: 5,
          backgroundColor: theme.palette.common.black,
          color: "white",
          "&:hover": {
            backgroundColor: theme.palette.grey[800],
          },
        }}
        style={{ borderRadius: "30px" }}
        onClick={goTo}
      >
        {t(transactionFlow ? "button.backToHome" : "history.availableRefunds")}
      </Button>
    </>
  );
};
