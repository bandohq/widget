import { alpha, Card, styled } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  border: "none",
  backgroundColor:
    theme.palette.mode === "light"
      ? alpha(theme.palette.common.black, 0.04)
      : alpha(theme.palette.common.white, 0.08),
}));
