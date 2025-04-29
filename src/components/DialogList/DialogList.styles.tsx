import { alpha, styled } from "@mui/material";

export const StyledItem = styled("div")(({ theme }) => ({
  padding: "15px 10px",
  display: "flex",
  width: "90%",
  margin: "0 auto",
  borderRadius: "5px",
  backgroundColor:
    theme.palette.mode === "light"
      ? alpha(theme.palette.common.black, 0.04)
      : alpha(theme.palette.common.white, 0.08),
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));
