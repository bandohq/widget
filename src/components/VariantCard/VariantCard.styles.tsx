import { alpha, styled } from "@mui/material";

export const StyledSearchInput = styled("input")(({ theme }) => ({
  width: "100%",
  padding: "12px 14px",
  borderRadius: 4,
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

export const VariantCardBox = styled("div")<{ isSelected: boolean }>(
  ({ isSelected, theme }) => ({
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    backgroundColor: isSelected
      ? theme.palette.primary.main
      : theme.palette.mode === "light"
      ? alpha(theme.palette.common.black, 0.04)
      : alpha(theme.palette.common.white, 0.08),
    padding: "10px 15px",
    borderRadius: 10,
    margin: "0 5px",
    color: isSelected ? theme.palette.primary.contrastText : "inherit",
  })
);

export const GridContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 8,
  marginTop: 8,
});

export const SliderWrapper = styled("div")({
  marginTop: 8,
  paddingLeft: 8,
  paddingRight: 8,
});
