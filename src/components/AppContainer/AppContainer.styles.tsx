import { Box, Container, ScopedCssBaseline, styled } from "@mui/material";
import type { WidgetVariant } from "../../types/widget";
import { defaultMaxHeight } from "../../config/constants";

// NOTE: the setting of the height in AppExpandedContainer, RelativeContainer and CssBaselineContainer can
//  be done dynamically by values in the config - namely the config.theme.container values display, maxHeight and height
//  A Number of other components and hooks work with height values that are often set on or derived from these elements
//  if there are changes to how the height works here you should also check the functionality of these hooks and their point of use
//    - useTokenListHeight
//    - useSetContentHeight
//  Also check any code that is using the methods from elements.ts utils file

export const AppExpandedContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant?: WidgetVariant }>(({ theme, variant }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "start",
  flex: 1,
  height:
    variant === "drawer"
      ? "none"
      : theme.container?.display === "flex"
      ? "100%"
      : theme.container?.maxHeight
      ? "auto"
      : theme.container?.height || "auto",
}));

export const RelativeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant?: WidgetVariant }>(({ theme, variant }) => {
  const container = { ...theme.container };

  if (variant === "drawer") {
    container.height = "100%";
  }

  return {
    position: "relative",
    boxSizing: "content-box",
    width: "100%",
    minWidth: theme.breakpoints.values.xs,
    maxWidth: theme.breakpoints.values.sm,
    background: theme.palette.background.default,
    flex: 1,
    zIndex: 0,
    ...container,
    minHeight: variant === "drawer" ? "100%" : "480px",
    maxHeight:
      variant === "drawer"
        ? "none"
        : theme.container?.display === "flex" && !theme.container?.height
        ? "100%"
        : theme.container?.maxHeight
        ? theme.container?.maxHeight
        : theme.container?.height || defaultMaxHeight,
  };
});

interface CssBaselineContainerProps {
  variant?: WidgetVariant;
  paddingTopAdjustment: number;
  elementId: string;
}

export const CssBaselineContainer = styled(ScopedCssBaseline, {
  shouldForwardProp: (prop) =>
    !["variant", "paddingTopAdjustment", "elementId"].includes(prop as string),
})<CssBaselineContainerProps>(({ theme, variant, paddingTopAdjustment }) => ({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  overflowX: "clip",
  margin: 0,
  width: "100%",
  maxHeight:
    variant === "drawer" || theme.container?.display === "flex"
      ? "none"
      : theme.container?.maxHeight
      ? theme.container?.maxHeight
      : theme.container?.height || defaultMaxHeight,
  overflowY: "auto",
  height: theme.container?.display === "flex" ? "auto" : "100%",
  paddingTop: paddingTopAdjustment,
  // This allows FullPageContainer.tsx to expand and fill the available vertical space in max height and default layout modes
  "&:has(.full-page-container)": {
    height: theme.container?.maxHeight
      ? theme.container?.maxHeight
      : theme.container?.height || defaultMaxHeight,
  },
}));

export const FlexContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  flex: 1,
});
