import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { Button, IconButton } from "@mui/material";
import { StyledCard } from "./VariantSlider.styles";
import CloseIcon from "@mui/icons-material/Close";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function VariantSlider({ variants, title, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [index, setIndex] = React.useState(0);
  const { updateProduct } = useProduct();

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setIndex(newValue);
    }
  };

  const handleSelectVariant = (variant) => {
    updateProduct(variant);
    onClose();
    navigate(`/form`);
  };

  const isValidValue = (val) =>
    val !== undefined && val !== null && val !== "" && val !== "0";

  const current = variants[index];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "12px 12px 0 0",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <Box sx={{ width: 300, mx: "auto", my: 4 }}>
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>

        <StyledCard sx={{ mb: 3 }}>
          <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar
              src={current?.imageUrl}
              alt="logo"
              variant="square"
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="h6" color="primary">
                ${parseFloat(current?.price.fiatValue).toFixed(2)}{" "}
                {current?.price.fiatCurrency}
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>

        <Slider
          value={index}
          min={0}
          step={1}
          max={variants.length - 1}
          onChange={handleChange}
          valueLabelFormat={(i) => variants[i].shortNotes}
        />
        <Typography variant="body2" color="text.secondary" align="center">
          {current?.notes}
        </Typography>

        <Box
          sx={{
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: "1fr 1fr",
            mt: 2,
          }}
        >
          {current?.dataUnlimited ? (
            <Typography variant="body1" color="text.secondary">
              {t("form.info.unlimitedGB")}
            </Typography>
          ) : isValidValue(current?.dataGB) ? (
            <Typography variant="body1" color="text.secondary">
              {t("form.info.gbQuantity", { quantity: current?.dataGB })}
            </Typography>
          ) : null}
          {current?.voiceUnlimited ? (
            <Typography variant="body1" color="text.secondary">
              {t("form.info.UnlimitedCalls")}
            </Typography>
          ) : isValidValue(current?.voiceMinutes) ? (
            <Typography variant="body1" color="text.secondary">
              {t("form.info.callQuantity", {
                quantity: current?.voiceMinutes,
              })}
            </Typography>
          ) : null}
          {current?.smsUnlimited ? (
            <Typography variant="body1" color="text.secondary">
              {t("form.info.unlimitedSMS")}
            </Typography>
          ) : isValidValue(current?.smsNumber) ? (
            <Typography variant="body1" color="text.secondary">
              {t("form.info.smsQuantity", { quantity: current?.smsNumber })}
            </Typography>
          ) : null}
          {isValidValue(current?.durationDays) && (
            <Typography variant="body1" color="text.secondary">
              {t("form.info.duration", { duration: current?.durationDays })}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => handleSelectVariant(current)}
        >
          {t("form.info.buy")}
        </Button>
      </Box>
    </>
  );
}
