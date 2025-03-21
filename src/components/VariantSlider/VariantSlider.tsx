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

export default function VariantSlider({ variants, title, onClose }) {
  const [index, setIndex] = React.useState(0);
  const { updateProduct } = useProduct();
  const navigate = useNavigate();

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
              Unlimited GB
            </Typography>
          ) : isValidValue(current?.dataGB) ? (
            <Typography variant="body1" color="text.secondary">
              {current?.dataGB} GB
            </Typography>
          ) : null}
          {current?.voiceUnlimited ? (
            <Typography variant="body1" color="text.secondary">
              Unlimited calls
            </Typography>
          ) : isValidValue(current?.voiceMinutes) ? (
            <Typography variant="body1" color="text.secondary">
              {current?.voiceMinutes} minutes
            </Typography>
          ) : null}
          {current?.smsUnlimited ? (
            <Typography variant="body1" color="text.secondary">
              Unlimited SMS
            </Typography>
          ) : isValidValue(current?.smsNumber) ? (
            <Typography variant="body1" color="text.secondary">
              {current?.smsNumber} SMS
            </Typography>
          ) : null}
          {isValidValue(current?.durationDays) && (
            <Typography variant="body1" color="text.secondary">
              {current?.durationDays} days
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
          Comprar
        </Button>
      </Box>
    </>
  );
}
