import type { ContainerProps } from "@mui/material";
import { Container, styled } from "@mui/material";
import { PoweredBy } from "./PoweredBy/PoweredBy";
import { useWidgetConfig } from "../providers/WidgetProvider/WidgetProvider";
import { HiddenUI } from "../types/widget";

export interface PageContainerProps extends ContainerProps {
  halfGutters?: boolean;
  topGutters?: boolean;
  bottomGutters?: boolean;
  isDrawer?: boolean;
}

const WidgetContainer = styled(Container, {
  shouldForwardProp: (prop) =>
    !["halfGutters", "topGutters", "bottomGutters"].includes(prop as string),
})<PageContainerProps>(
  ({ theme, disableGutters, halfGutters, topGutters, bottomGutters }) => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: disableGutters
      ? 0
      : theme.spacing(
          topGutters ? 1 : 0,
          halfGutters ? 1.5 : 3,
          bottomGutters ? 3 : 0,
          halfGutters ? 1.5 : 3
        ),
  })
);

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  ...props
}) => {
  const { hiddenUI } = useWidgetConfig();
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);
  return (
    <WidgetContainer {...props}>
      {children}
      {!props.isDrawer && (showPoweredBy ? <PoweredBy /> : null)}
    </WidgetContainer>
  );
}
