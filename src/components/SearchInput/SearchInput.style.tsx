import { alpha, styled, TextField } from "@mui/material";

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor:
      theme.palette.mode === "light"
        ? alpha(theme.palette.background.paper, 0.04)
        : alpha(theme.palette.background.paper, 0.08),
    paddingRight: "8px",
    width: "90%",
    margin: "0 auto",
    "&:hover": {
      borderColor: "#d3d3d3",
    },
    "&.Mui-focused": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px 14px",
  },
}));
