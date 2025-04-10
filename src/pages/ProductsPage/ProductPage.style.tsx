import { alpha, Box, IconButton, InputBase, styled } from "@mui/material";

export const BrandsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gridAutoRows: "minmax(60px, 85px)",
  gap: 10,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "repeat(4, 1fr)",
  },
  [theme.breakpoints.down("xs")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

export const BrandsGrid = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "start",
  cursor: "pointer",
}));

export const SearchContainer = styled("div")(() => ({
  display: "flex",
  alignItems: "space-between",
  gap: 3,
  overflow: "hidden",
  backgroundColor: "transparent",
  width: "100%",
  height: "40px",
  margin: "10px 0",
}));

export const InputContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  backgroundColor:
    theme.palette.mode === "light"
      ? alpha(theme.palette.background.paper, 0.04)
      : alpha(theme.palette.background.paper, 0.08),
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  width: "100%",
  height: "40px",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  fontSize: "14px",
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  color: "#6b7280",
  "&:hover": {
    color: "#6b7280",
  },
}));

export const StyledCountryDiv = styled("div")(({ theme }) => ({
  height: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  cursor: "pointer",
  backgroundColor:
    theme.palette.mode === "light"
      ? alpha(theme.palette.background.paper, 0.04)
      : alpha(theme.palette.background.paper, 0.08),
}));
