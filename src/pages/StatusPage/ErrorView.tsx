import { AccordionDetails, Button, Typography } from "@mui/material";
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
  const navigate = useNavigate();
  const { t } = useTranslation();

  console.log(transaction);

  //Todo: send direct to refound page once serviceId comes from transaction detail
  const goToHistory = () => {
    navigate(navigationRoutes.transactionHistory);
  };

  const gotoDiscover = () => {
    navigate(navigationRoutes.home);
  };
  return (
    <>
      <IconWrapper bgColor="#FAC985">
        <SmileyMelting size={50} />
      </IconWrapper>
      <StatusTitle>{t("error.title.orderFailed")}</StatusTitle>
      <StatusSubtitle>{t("error.title.retry")}</StatusSubtitle>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", marginTop: "20px", fontWeight: "200" }}
      >
        You can go to your transaction history and ask for a refund
      </Typography>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <Button
          variant="outlined"
          style={{ borderRadius: "30px" }}
          onClick={goToHistory}
        >
          {t("history.goToHistory")}
        </Button>
        <Button
          variant="outlined"
          style={{ borderRadius: "30px" }}
          onClick={gotoDiscover}
        >
          {t("button.discover")}
        </Button>
      </div>
    </>
  );
};
