import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { Warning } from "@phosphor-icons/react";
import { navigationRoutes } from "../../utils/navigationRoutes";

// Tipo personalizado para errores de fetch
interface FetchError extends Error {
  status?: number;
  data?: unknown;
}

interface TransactionErrorViewProps {
  error: FetchError;
  onRetry: () => void;
}

export const TransactionErrorView = ({ error, onRetry }: TransactionErrorViewProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const getErrorMessage = () => {
    if (error.status === 404) {
      return t("error.message.transactionNotFound", "Transaction not found");
    }
    if (error.status === 403) {
      return t(
        "error.message.unauthorized",
        "You don't have permission to view this transaction"
      );
    }
    if (error.status >= 500) {
      return t(
        "error.message.serverError",
        "Server error, please try again later"
      );
    }
    return t("error.message.unknown", "Please try again or contact support.");
  };

  const handleGoBack = () => {
    navigate(navigationRoutes.transactionHistory);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: 3,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: theme.palette.error.light,
          marginBottom: 2,
        }}
      >
        <Warning size={40} color={theme.palette.error.contrastText} />
      </Box>

      <Typography variant="h5" gutterBottom>
        {t("error.title.transactionFailed", "Error at fetching transaction")}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400 }}
      >
        {getErrorMessage()}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: "column",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          {t("button.retry", "Reintentar")}
        </Button>

        <Button
          variant="outlined"
          onClick={handleGoBack}
          sx={{
            borderColor: theme.palette.grey[400],
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.grey[600],
              backgroundColor: theme.palette.grey[50],
            },
          }}
        >
          {t("button.goBack", "Go back")}
        </Button>
      </Box>
    </Box>
  );
}; 