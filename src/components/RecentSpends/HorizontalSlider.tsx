import React from "react";
import { Box, Chip, Paper, Skeleton, Typography } from "@mui/material";

const HorizontalSlider = ({
  items,
  isPending,
}: {
  items: any[];
  isPending: boolean;
}) => {
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
      {!isPending
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={"200px"}
              height={32}
              animation="wave"
            />
          ))
        : items.map((item) => (
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
