import React from "react";
import { PageContainer } from "../../components/PageContainer";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import {
  Box,
  Chip,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useHeader } from "../../hooks/useHeader";

export const TopupPage: React.FC = () => {
  const { brand } = useProduct();
  const theme = useTheme();

  useHeader(brand.brandName);

  console.log(brand);

  return (
    <PageContainer>
      <ImageAvatar
        src={brand.imageUrl}
        name={brand.brandName}
        sx={{ width: 100, height: 100 }}
        hideName
      />

      <Typography
        variant="body2"
        sx={{ mt: 2, color: theme.palette.text.secondary }}
      >
        Type of product
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Chip label={"airtime"} />
        <Chip label={"data"} />
        <Chip label={"sms"} />
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: theme.palette.text.secondary }}
      >
        Search by amount
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <TextField
          placeholder="Amount"
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <MagnifyingGlass />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          sx={{
            width: "100%",
            border: "none",
            background: "transparent",
            outline: "none",
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: theme.palette.text.secondary }}
      >
        All available amounts
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          mt: 1,
        }}
      >
        {brand.variants.map((variant) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              backgroundColor: theme.palette.background.paper,
              padding: "10px 15px",
              borderRadius: 10,
            }}
          >
            <Typography variant="body1">
              {parseFloat(variant.price.fiatValue).toFixed(2)}
            </Typography>
            <Typography variant="body1">
              {variant.price.fiatCurrency}
            </Typography>
          </div>
        ))}
      </Box>
    </PageContainer>
  );
};
