import React, { useEffect } from "react";
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
    arrows: false,
    dots: false,
    draggable: true,
    speed: 100,
    slidesToShow: 3,
    infinite: false,
    swipe: true,
    swipeToSlide: true,
    ref: sliderRef,
    initialSlide: selectedIndex > 0 ? selectedIndex : 0,
  };

  // Asegurarse de que el slider se posicione correctamente cuando cambia el índice seleccionado
  useEffect(() => {
    if (selectedIndex !== -1 && sliderRef.current) {
      // Pequeño retraso para asegurar que el slider esté completamente renderizado
      setTimeout(() => {
        sliderRef.current?.slickGoTo(selectedIndex, true);
      }, 50);
    }
  }, [selectedIndex, sliderRef]);

  return (
    <>
      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        All available amounts
      </Typography>
      {variants.length > 0 && selectedIndex !== -1 ? (
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
