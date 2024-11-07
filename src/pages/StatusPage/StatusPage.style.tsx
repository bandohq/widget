import {
  Accordion,
  AccordionSummary,
  Box,
  BoxProps,
  styled,
  Typography,
} from "@mui/material";

export const StatusPageContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const StatusTitle = styled(Typography)(() => ({
  fontSize: "32px",
  fontWeight: 500,
  textAlign: "center",
  margin: "10px 0",
}));

export const StatusSubtitle = styled(Typography)(() => ({
  fontSize: "24px",
  fontWeight: 200,
  textAlign: "center",
  margin: "0",
}));

interface IconWrapperProps extends BoxProps {
  bgColor?: string;
}

export const IconWrapper = styled(Box)<IconWrapperProps>(
  ({ theme, bgColor }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
    borderRadius: "100%",
    width: "70px",
    height: "70px",
    backgroundColor: bgColor || theme.palette.background.default,
  })
);

export const CustomAccordion = styled(Accordion)(({ theme }) => ({
  border: "none",
  boxShadow: "none",
  margin: "20px 0",
  "&:before": {
    display: "none",
  },
}));

export const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  width: "70%",
  margin: "0 auto",
}));
