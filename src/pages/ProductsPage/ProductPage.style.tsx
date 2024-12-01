import { Box, IconButton, InputBase, Select, styled } from "@mui/material";

export const BrandsContainer = styled(Box)(({ theme }) => ({
  display: "block",
  gridTemplateColumns: "repeat(5, 1fr)",
  gridAutoRows: "minmax(60px, auto)",
  gap: 5,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const BrandsGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const SearchContainer = styled("div")(() => ({
  display: "flex",
  alignItems: "space-between",
  gap: 3,
  overflow: "hidden",
  backgroundColor: "#fff",
  width: "100%",
  height: "40px",
  margin: "10px 0",
}));

export const InputContainer = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  backgroundColor: "transparent",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  width: "100%",
  height: "40px",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  fontSize: "14px",
  color: "#6b7280",
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  color: "#6b7280",
}));

export const CountrySelect = styled(Select)(({ theme }) => ({
  height: "100%",
  border: "1px solid #e2e8f0",
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    paddingRight: theme.spacing(2),
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));
