import React from "react";
import { Typography, useTheme } from "@mui/material";
import { VariantCardBox } from "./VariantCard.styles";
import { Variant } from "../../stores/ProductProvider/types";

type Props = {
  variant: Variant;
  isSelected: boolean;
  onClick?: () => void;
};

export const VariantCard: React.FC<Props> = ({ variant, isSelected, onClick }) => {
  return (
    <VariantCardBox isSelected={isSelected} onClick={onClick}>
      <Typography variant="body1">
        {parseFloat(variant.price.fiatValue).toFixed(2)}
      </Typography>
      <Typography variant="body1">{variant.price.fiatCurrency}</Typography>
    </VariantCardBox>
  );
};
