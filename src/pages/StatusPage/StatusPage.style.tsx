import {
  Accordion,
  AccordionSummary,
  Box,
  BoxProps,
  keyframes,
  styled,
  Typography,
} from "@mui/material";

interface IconWrapperProps extends BoxProps {
  bgColor?: string;
}

interface TypographyProps extends BoxProps {
  fontSize?: string;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const AnimatedCircularProgress = styled(Box)(() => ({
  display: "inline-block",
  animation: `${rotate} 2s linear infinite`,
}));

export const StatusPageContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const StatusTitle = styled(Typography)<TypographyProps>(
  ({ fontSize }) => ({
    fontSize: fontSize || "32px",
    fontWeight: 500,
    textAlign: "center",
    margin: "10px 0",
  })
);

export const StatusSubtitle = styled(Typography)<TypographyProps>(
  ({ fontSize }) => ({
    fontSize: fontSize || "24px",
    fontWeight: 200,
    textAlign: "center",
    margin: "0",
  })
);

export const IconWrapper = styled(Box)<IconWrapperProps>(({ bgColor }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
  borderRadius: "100%",
  width: "70px",
  height: "70px",
  backgroundColor: bgColor || "transparent",
}));

export const CustomAccordion = styled(Accordion)(({ theme }) => ({
  border: "none",
  boxShadow: "none",
  margin: "20px 0",
  "&:before": {
    display: "none",
  },
}));

export const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  margin: "0 auto",
}));

export const ProductBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  margin: "20px 0",
  flexDirection: "column",
  gap: "10px",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid",
  borderColor: theme.palette.grey[300],
}));
