import { AppRoutes } from "./AppRoutes";
import {
  AppExpandedContainer,
  FlexContainer,
} from "./components/AppContainer/AppContainer.styles";
import { AppContainer } from "./components/AppContainer/AppContainer";
import { useWidgetConfig } from "./providers/WidgetProvider/WidgetProvider";
import { ElementId, createElementId } from "./utils/elements";
import { Header } from "./components/Header/Header";

export const AppDefault = () => {
  const { elementId } = useWidgetConfig();

  return (
    <AppExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
    >
      <AppContainer>
        <Header />
        <FlexContainer disableGutters>
          <AppRoutes />
        </FlexContainer>
      </AppContainer>
    </AppExpandedContainer>
  );
};
