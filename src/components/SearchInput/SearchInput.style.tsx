import { alpha, styled, TextField, CSSObject } from "@mui/material";

export const StyledTextField = styled(TextField)(({ theme }) => {
  const root = theme.components?.MuiInputCard?.styleOverrides?.root as CSSObject
  if(root) {
    return {
      ...root,
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        paddingRight: "8px",
        width: "90%",
        margin: "0 auto",
      },
      "& .MuiOutlinedInput-input": {
        padding: "10px 14px",
      },
    }
  } else {
    return {
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor:
          theme.palette.mode === "light"
            ? alpha(theme.palette.grey[800], 0.1)
            : alpha(theme.palette.grey[300], 0.1),
        paddingRight: "8px",
        width: "90%",
        margin: "0 auto",
      },
      "& .MuiOutlinedInput-input": {
        padding: "10px 14px",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    }
}
});
