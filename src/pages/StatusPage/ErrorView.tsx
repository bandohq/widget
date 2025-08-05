import {
  AccordionDetails,
  Alert,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { IconWrapper, StatusSubtitle, StatusTitle } from "./StatusPage.style";
import { SmileyMelting, CaretDown } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { navigationRoutes } from "../../utils/navigationRoutes";

interface ErrorViewProps {
  errorMessage?: any;
  isErrorLoading?: boolean;
}

export const ErrorView = ({ isErrorLoading = false }: ErrorViewProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goTo = () => {
    if (isErrorLoading) {
      navigate(navigationRoutes.transactionHistory);
    } else {
      navigate(navigationRoutes.home);
    }
  };

  const getTitle = () => {
    if (isErrorLoading) {
      return t("error.title.unknown");
    }
    return t("error.title.orderFailed");
  };

  const getSubtitle = () => {
    if (isErrorLoading) {
      return t("error.title.checkHistory");
    }
    return t("error.title.retry");
  };

  const getAlertMessage = () => {
    if (isErrorLoading) {
      return t("error.message.checkHistoryForStatus");
    }
    return t("history.instructionsNewFlow");
  };

  const getButtonText = () => {
    if (isErrorLoading) {
      return t("button.goToHistory");
    }
    return t("button.backToHome");
  };

  return (
    <>
      <IconWrapper bgColor="#FAC985">
        <SmileyMelting size={50} />
      </IconWrapper>
      <StatusTitle>{getTitle()}</StatusTitle>
      <StatusSubtitle>{getSubtitle()}</StatusSubtitle>

      <Alert sx={{ mt: 2 }} severity="info">
        {getAlertMessage()}
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
        {getButtonText()}
      </Button>
    </>
  );
};
