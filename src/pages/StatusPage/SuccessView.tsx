import { useNavigate } from "react-router-dom";
import { AccordionDetails, Button, Typography } from "@mui/material";
import {
  CustomAccordion,
  CustomAccordionSummary,
  IconWrapper,
  ProductBox,
  StatusSubtitle,
  StatusTitle,
} from "./StatusPage.style";
import { Check, CaretDown, Barcode } from "@phosphor-icons/react";
import { palette } from "../../themes/palettes";
import { navigationRoutes } from "../../utils/navigationRoutes";

export const SuccessView = () => {
  const navigate = useNavigate();

  const gotoHome = () => {
    navigate(navigationRoutes.home);
  };
  return (
    <>
      <IconWrapper bgColor={palette.primary.medium}>
        <Check size={50} />
      </IconWrapper>
      <StatusTitle>Order completed</StatusTitle>
      <StatusSubtitle>Thank you for your purchase.</StatusSubtitle>

      <ProductBox>
        <Barcode
          size={32}
          style={{ boxShadow: "0px 11px 32px -17px rgba(0,0,0,0.84)" }}
        />
        <StatusTitle fontSize="26px">
          {"Product name"} - {"$0.00"}
        </StatusTitle>
        <StatusSubtitle fontSize="18px">
          We have sent the gift card to your email.
        </StatusSubtitle>
      </ProductBox>

      <CustomAccordion>
        <CustomAccordionSummary
          expandIcon={<CaretDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Order details</Typography>
        </CustomAccordionSummary>
        <AccordionDetails>
          <Typography>Contenido de la sección 1.</Typography>
        </AccordionDetails>
      </CustomAccordion>

      <Button
        variant="contained"
        fullWidth
        style={{ borderRadius: "30px" }}
        onClick={gotoHome}
      >
        Discover more
      </Button>
    </>
  );
};
