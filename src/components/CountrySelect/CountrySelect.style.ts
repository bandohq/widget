import { Select, styled } from "@mui/material";

export const StyledCountrySelect = styled(Select)(({ theme }) => ({
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