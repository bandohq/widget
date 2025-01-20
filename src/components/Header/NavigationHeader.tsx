import { Box, Typography } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { useNavigateBack } from "../../hooks/useNavigateBack";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { useHeaderStore } from "../../stores/header/useHeaderStore";
import { HiddenUI } from "../../types/widget";
import {
  backButtonRoutes,
  navigationRoutes,
  navigationRoutesValues,
} from "../../utils/navigationRoutes";
import { BackButton } from "./BackButton";
import { CloseDrawerButton } from "./CloseDrawerButton";
import { HeaderAppBar, HeaderControlsContainer } from "./Header.style";
import { SettingsButton } from "./SettingsButton";
import { SplitWalletMenuButton } from "./WalletHeader";

export const NavigationHeader: React.FC = () => {
  const { subvariant, hiddenUI, variant } = useWidgetConfig();
  const { navigateBack } = useNavigateBack();
  const { element, title } = useHeaderStore((state) => state);
  const { pathname } = useLocation();

  const cleanedPathname = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  const path = cleanedPathname.substring(cleanedPathname.lastIndexOf("/") + 1);
  const hasPath = navigationRoutesValues.includes(path);

  const basePath = cleanedPathname.split("/")[1];
  const isBackButtonVisible =
    backButtonRoutes.includes(`/${basePath}`) || basePath === "products";

  const splitSubvariant = subvariant === "split" && !hasPath;

  return (
    <>
      <HeaderAppBar elevation={0}>
        {isBackButtonVisible ? <BackButton onClick={navigateBack} /> : null}
        {splitSubvariant ? (
          <Box flex={1}>
            <SplitWalletMenuButton />
          </Box>
        ) : (
          <Typography
            fontSize={hasPath ? 18 : 24}
            align={hasPath ? "center" : "left"}
            fontWeight="700"
            flex={1}
            noWrap
          >
            {title}
          </Typography>
        )}
        <Routes>
          <Route
            path={navigationRoutes.home}
            element={
              <HeaderControlsContainer>
                <SettingsButton />
                {variant === "drawer" &&
                !hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (
                  <CloseDrawerButton header="navigation" />
                ) : null}
              </HeaderControlsContainer>
            }
          />
          <Route path="*" element={element || <Box width={28} height={40} />} />
        </Routes>
      </HeaderAppBar>
    </>
  );
};
