import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ArrowClockwise } from "@phosphor-icons/react";
import { NotFound } from "../../assets/NotFound";

interface ProductErrorProps {
  type: "loadError" | "noProducts";
  onRetry?: () => void;
}

export const ProductError: React.FC<ProductErrorProps> = ({ type, onRetry }) => {
  const { t } = useTranslation();

  const getErrorContent = () => {
    switch (type) {
      case "loadError":
        return {
          message: t("error.message.catalogLoadFailed"),
          showRetry: true,
        };
      case "noProducts":
        return {
          message: t("error.message.noProductsAvailable"),
          showRetry: false,
        };
      default:
        return {
          message: t("error.message.unknown"),
          showRetry: true,
        };
    }
  };

  const { message, showRetry } = getErrorContent();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        textAlign: "center",
        minHeight: "300px",
      }}
    >
      <img
        src={NotFound}
        alt="No products"
        style={{ width: "120px", height: "120px", marginBottom: "16px" }}
      />
      <Typography
        variant="h6"
        color="text.primary"
        sx={{ marginBottom: 1, fontWeight: 600 }}
      >
        {type === "loadError" ? "Error" : "Sin productos"}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: 3, maxWidth: "300px" }}
      >
        {message}
      </Typography>
      {showRetry && onRetry && (
        <Button
          variant="outlined"
          startIcon={<ArrowClockwise size={16} />}
          onClick={onRetry}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            minWidth: "120px",
          }}
        >
          {t("button.tryAgain")}
        </Button>
      )}
    </Box>
  );
}; 