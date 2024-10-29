"use client";
import { AppRoutes } from "./AppRoutes";
import {
  AppExpandedContainer,
  FlexContainer,
} from "./components/AppContainer/AppContainer.styles";
import { AppContainer } from "./components/AppContainer/AppContainer";
// import { Header } from './components/Header/Header.js'
// import { Initializer } from './components/Initializer.js'
// import { RoutesExpanded } from './components/Routes/RoutesExpanded.js'
// import { useWideVariant } from './hooks/useWideVariant.js'
import { useWidgetConfig } from "./providers/WidgetProvider/WidgetProvider.js";
import { ElementId, createElementId } from "./utils/elements.js";

export const AppDefault = () => {
  const { elementId } = useWidgetConfig();

  return (
    <AppExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
    >
      <AppContainer>
        {/* <Header /> */}
        <FlexContainer disableGutters>
          <AppRoutes />
        </FlexContainer>
        {/* <Initializer /> */}
      </AppContainer>
    </AppExpandedContainer>
  );
};
