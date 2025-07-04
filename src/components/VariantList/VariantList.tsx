import React, { useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Slider from "react-slick";
import {
  GridContainer,
  SliderWrapper,
} from "../VariantCard/VariantCard.styles";
import { VariantCard } from "../VariantCard/VariantCard";
import VariantInfo from "../VariantInfo/VariantInfo";
import { Variant } from "../../stores/ProductProvider/types";
import { useTranslation } from "react-i18next";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

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
  const { t } = useTranslation();
  const theme = useTheme();

  const iconColor = theme.palette.mode === "light" ? "black" : "white";

  const sliderSettings = {
    arrows: true,
    dots: false,
    draggable: true,
    speed: 100,
    slidesToShow: 3,
    infinite: false,
    swipe: true,
    swipeToSlide: true,
    ref: sliderRef,
    initialSlide: selectedIndex > 0 ? selectedIndex : 0,
    nextArrow: <CaretRight color={iconColor} />,
    prevArrow: <CaretLeft color={iconColor} />,
  };

  // be sure the slider is positioned correctly when the selected index changes
  useEffect(() => {
    if (selectedIndex !== -1 && sliderRef.current) {
      // small delay to ensure the slider is fully rendered
      setTimeout(() => {
        sliderRef.current?.slickGoTo(selectedIndex, true);
      }, 50);
    }
  }, [selectedIndex, sliderRef]);

  return (
    <>
      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        {t("variantList.allAvailableAmounts")}
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
