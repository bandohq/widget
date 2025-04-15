import React, { useState, useEffect } from "react";
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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const TopupPage: React.FC = () => {
  const { brand } = useProduct();
  const theme = useTheme();
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const sliderRef = React.useRef<Slider>(null);

  useHeader(brand.brandName);

  const orderedVariants = brand.variants.sort(
    (a, b) => parseFloat(a.price.fiatValue) - parseFloat(b.price.fiatValue)
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value && !isNaN(Number(value))) {
      const targetValue = parseFloat(value);
      const closestVariant = orderedVariants.reduce(
        (closest, current, index) => {
          const currentValue = parseFloat(current.price.fiatValue);
          const closestValue = parseFloat(closest.price.fiatValue);
          const currentDiff = Math.abs(currentValue - targetValue);
          const closestDiff = Math.abs(closestValue - targetValue);

          if (currentDiff < closestDiff) {
            setSelectedIndex(index);
            return current;
          }
          return closest;
        },
        brand.variants[0]
      );

      if (sliderRef.current) {
        sliderRef.current.slickGoTo(selectedIndex);
      }
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    ref: sliderRef,
  };

  const VariantCard = ({
    variant,
    isSelected,
  }: {
    variant: any;
    isSelected: boolean;
  }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "center",
        backgroundColor: isSelected
          ? theme.palette.primary.main
          : theme.palette.background.paper,
        padding: "10px 15px",
        borderRadius: 10,
        margin: "0 5px",
        color: isSelected ? theme.palette.primary.contrastText : "inherit",
      }}
    >
      <Typography variant="body1">
        {parseFloat(variant.price.fiatValue).toFixed(2)}
      </Typography>
      <Typography variant="body1">{variant.price.fiatCurrency}</Typography>
    </div>
  );

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
          value={inputValue}
          onChange={handleInputChange}
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
      {inputValue ? (
        <Box sx={{ mt: 1, px: 1 }}>
          <Slider {...sliderSettings}>
            {orderedVariants.map((variant, index) => (
              <VariantCard
                key={variant.price.fiatValue}
                variant={variant}
                isSelected={index === selectedIndex}
              />
            ))}
          </Slider>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            mt: 1,
          }}
        >
          {orderedVariants.map((variant, index) => (
            <VariantCard
              key={variant.price.fiatValue}
              variant={variant}
              isSelected={index === selectedIndex}
            />
          ))}
        </Box>
      )}
    </PageContainer>
  );
};
