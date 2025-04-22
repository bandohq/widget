import React from "react";
import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import {
  GridContainer,
  SliderWrapper,
} from "../VariantCard/VariantCard.styles";
import { VariantCard } from "../VariantCard/VariantCard";
import VariantInfo from "../VariantInfo/VariantInfo";
import { Variant } from "../../stores/ProductProvider/types";

interface VariantListProps {
  variants: Variant[];
  selectedIndex: number;
  brandName: string;
  onVariantClick: (variant: Variant, index: number) => void;
  sliderRef: React.RefObject<Slider>;
}

export const VariantList: React.FC<VariantListProps> = ({
  variants,
  selectedIndex,
  brandName,
  onVariantClick,
  sliderRef,
}) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    draggable: true,
    speed: 100,
    slidesToShow: 3,
    swipe: true,
    swipeToSlide: true,
    ref: sliderRef,
  };

  return (
    <>
      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        All available amounts
      </Typography>
      {variants.length > 0 ? (
        <>
          <SliderWrapper>
            <Slider {...sliderSettings}>
              {variants.map((variant, index) => (
                <VariantCard
                  onClick={() => onVariantClick(variant, index)}
                  key={variant.price.fiatValue}
                  variant={variant}
                  isSelected={index === selectedIndex}
                />
              ))}
            </Slider>
          </SliderWrapper>
          <Box sx={{ mt: 4 }}>
            <VariantInfo variant={variants[selectedIndex]} title={brandName} />
          </Box>
        </>
      ) : (
        <GridContainer>
          {variants.map((variant, index) => (
            <VariantCard
              key={variant.price.fiatValue}
              variant={variant}
              isSelected={index === selectedIndex}
              onClick={() => onVariantClick(variant, index)}
            />
          ))}
        </GridContainer>
      )}
    </>
  );
};
