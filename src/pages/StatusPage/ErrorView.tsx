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

export const ErrorView = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const gotoHome = () => {
    navigate(navigationRoutes.home);
  };
  return (
    <>
      <IconWrapper bgColor="#FAC985">
        <SmileyMelting size={50} />
      </IconWrapper>
      <StatusTitle>{t("error.title.orderFailed")}</StatusTitle>
      <StatusSubtitle>{t("error.title.retry")}</StatusSubtitle>

      <CustomAccordion>
        <CustomAccordionSummary
          expandIcon={<CaretDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{t("success.title.orderDetails")}</Typography>
        </CustomAccordionSummary>
        <AccordionDetails>
          <Typography>Contenido de la sección 1.</Typography>
        </AccordionDetails>
      </CustomAccordion>

      <Button
        variant="outlined"
        fullWidth
        style={{ borderRadius: "30px" }}
        onClick={gotoHome}
      >
        {t("button.backToOrder")}
      </Button>
    </>
  );
};
