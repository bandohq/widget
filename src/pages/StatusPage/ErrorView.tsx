import { AccordionDetails, Button, Typography } from "@mui/material";
import {
  CustomAccordion,
  CustomAccordionSummary,
  IconWrapper,
  StatusSubtitle,
  StatusTitle,
} from "./StatusPage.style";
import { SmileyMelting, CaretDown } from "@phosphor-icons/react";

export const ErrorView = () => {
  return (
    <>
      <IconWrapper bgColor="#FAC985">
        <SmileyMelting size={50} />
      </IconWrapper>
      <StatusTitle>Oh... There was a problem</StatusTitle>
      <StatusSubtitle>Please, try again later.</StatusSubtitle>

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

      <Button variant="outlined" fullWidth style={{ borderRadius: "30px" }}>
        Back to your order
      </Button>
    </>
  );
};
