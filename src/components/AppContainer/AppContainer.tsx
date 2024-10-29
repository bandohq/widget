import type { PropsWithChildren } from "react";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";
import { useHeaderHeight } from "../../stores/header/useHeaderStore.js";
// import type { WidgetVariant } from "../../types/widget.js";
import { ElementId, createElementId } from "../../utils/elements.js";
import {
  CssBaselineContainer,
  FlexContainer,
  RelativeContainer,
} from "./AppContainer.styles.js";

export const AppContainer: React.FC<PropsWithChildren> = ({ children }) => {
  // const ref = useRef<HTMLDivElement>(null);
  const { variant, elementId, theme } = useWidgetConfig();
  const { headerHeight } = useHeaderHeight();
  const positionFixedAdjustment =
    theme?.header?.position === "fixed" ? headerHeight : 0;

  return (
    <RelativeContainer
      variant={variant}
      id={createElementId(ElementId.RelativeContainer, elementId)}
    >
      <CssBaselineContainer
        id={createElementId(ElementId.ScrollableContainer, elementId)}
        variant={variant}
        enableColorScheme
        paddingTopAdjustment={positionFixedAdjustment}
        elementId={elementId}
        // ref={ref}
      >
        <FlexContainer disableGutters>{children}</FlexContainer>
      </CssBaselineContainer>
    </RelativeContainer>
  );
};
