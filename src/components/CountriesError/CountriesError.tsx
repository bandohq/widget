import React from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { ArrowClockwise, Warning } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { CountryError } from "../../stores/CountriesProvider/types";

interface CountriesErrorProps {
  error: CountryError | null;
  onRetry: () => void;
  isRetrying?: boolean;
  variant?: "alert" | "fullPage";
}

export const CountriesError: React.FC<CountriesErrorProps> = ({
  error,
  onRetry,
  isRetrying = false,
  variant = "alert",
}) => {
  const { t } = useTranslation();

  if (!error) return null;

  const handleRetry = () => {
    onRetry();
  };

  if (variant === "alert") {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleRetry}
            disabled={isRetrying}
            startIcon={<ArrowClockwise />}
          >
            {t("button.tryAgain")}
          </Button>
        }
        sx={{ mb: 2 }}
      >
        <Typography variant="body2">{error.message}</Typography>
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 4,
        px: 2,
      }}
    >
      <Warning size={48} color="#f44336" />
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        {t("error.title.countriesUnavailable")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {error.message}
      </Typography>
      <Button
        variant="contained"
        onClick={handleRetry}
        disabled={isRetrying}
        startIcon={<ArrowClockwise />}
        sx={{ borderRadius: 2 }}
      >
        {t("button.tryAgain")}
      </Button>
    </Box>
  );
};
