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

export const ErrorView = ({ transaction }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  console.log(transaction);

  //Todo: send direct to refound page once serviceId comes from transaction detail
  const goToHistory = () => {
    navigate(navigationRoutes.transactionHistory);
  };
  return (
    <>
      <IconWrapper bgColor="#FAC985">
        <SmileyMelting size={50} />
      </IconWrapper>
      <StatusTitle>{t("error.title.orderFailed")}</StatusTitle>
      <StatusSubtitle>{t("error.title.retry")}</StatusSubtitle>

      <Alert sx={{ mt: 2 }} severity="info">
        {t("history.instructions")}
      </Alert>
      <Button
        fullWidth
        sx={{
          mt: 2,
          backgroundColor: theme.palette.common.black,
          color: "white",
          "&:hover": {
            backgroundColor: theme.palette.grey[800],
          },
        }}
        style={{ borderRadius: "30px" }}
        onClick={goToHistory}
      >
        {t("history.availableRefunds")}
      </Button>
    </>
  );
};
