import React from "react";
import { Typography, useTheme } from "@mui/material";
import { VariantCardBox } from "./VariantCard.styles";

type Props = {
  variant: any;
  isSelected: boolean;
};

export const VariantCard: React.FC<Props> = ({ variant, isSelected }) => {
  const theme = useTheme();

  return (
    <VariantCardBox isSelected={isSelected}>
      <Typography variant="body1">
        {parseFloat(variant.price.fiatValue).toFixed(2)}
      </Typography>
      <Typography variant="body1">{variant.price.fiatCurrency}</Typography>
    </VariantCardBox>
  );
};
