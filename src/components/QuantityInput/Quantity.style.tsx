import { Box, Card, IconButton, darken, lighten, styled } from "@mui/material";

export const maxInputFontSize = 24;
export const minInputFontSize = 14;

export const InputCard = styled(Card, {
  name: "MuiInputCard",
  slot: "root",
})(({ theme }) => ({
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? darken(theme.palette.background.paper, 0.02)
        : lighten(theme.palette.background.paper, 0.02),
    "& .MuiInputBase-root": {
      backgroundColor: "black",
      color: "white",
    },
  },
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  fontSize: 24,
}));

export const FormButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  fontSize: 20,
  backgroundColor: "rgba(0, 0, 0, 0.04)",
}));
