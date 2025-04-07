import React from "react";
import { Box, Chip, Paper, Typography } from "@mui/material";

const HorizontalSlider = ({ items }: { items: any[] }) => {
  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 1,
        whiteSpace: "nowrap",
        scrollbarWidth: "none",
      }}
    >
      {items.map((item) => (
        <Chip
          color="default"
          onClick={() => {}}
          size="small"
          label={item.brandName}
        />
      ))}
    </Box>
  );
};

export default HorizontalSlider;
