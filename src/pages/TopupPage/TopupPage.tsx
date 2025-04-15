import React, { useState, useRef, useCallback } from "react";
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
import {
  GridContainer,
  SliderWrapper,
  StyledSearchInput,
} from "../../components/VariantCard/VariantCard.styles";
import { VariantCard } from "../../components/VariantCard/VariantCard";
import { getClosestVariantIndex } from "../../utils/getClosestVariant";

export const TopupPage: React.FC = () => {
  const { brand } = useProduct();
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  useHeader(brand.brandName);

  const orderedVariants = brand.variants.sort(
    (a, b) => parseFloat(a.price.fiatValue) - parseFloat(b.price.fiatValue)
  );

  const updateSelectedVariant = useCallback(
    (value: string) => {
      if (value && !isNaN(Number(value))) {
        const targetValue = parseFloat(value);
        const closestIndex = getClosestVariantIndex(
          orderedVariants,
          targetValue
        );
        setSelectedIndex(closestIndex);
        sliderRef.current?.slickGoTo(closestIndex);
      }
    },
    [orderedVariants]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      updateSelectedVariant(value);
    }, 300);
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    ref: sliderRef,
  };

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
        <Chip label="airtime" />
        <Chip label="data" />
        <Chip label="sms" />
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
          fullWidth
        />
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: theme.palette.text.secondary }}
      >
        All available amounts
      </Typography>
      {inputValue ? (
        <SliderWrapper>
          <Slider {...sliderSettings}>
            {orderedVariants.map((variant, index) => (
              <VariantCard
                key={variant.price.fiatValue}
                variant={variant}
                isSelected={index === selectedIndex}
              />
            ))}
          </Slider>
        </SliderWrapper>
      ) : (
        <GridContainer>
          {orderedVariants.map((variant, index) => (
            <VariantCard
              key={variant.price.fiatValue}
              variant={variant}
              isSelected={index === selectedIndex}
            />
          ))}
        </GridContainer>
      )}
    </PageContainer>
  );
};
