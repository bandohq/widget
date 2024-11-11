import { Box, styled } from "@mui/material";

export const ProductsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gridAutoRows: "minmax(60px, auto)",
  gap: 5,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));
