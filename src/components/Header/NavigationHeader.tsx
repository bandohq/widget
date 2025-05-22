import { Box, Typography } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useNavigateBack } from "../../hooks/useNavigateBack";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { useHeaderStore } from "../../stores/header/useHeaderStore";
import { HiddenUI } from "../../types/widget";
import {
  backButtonRoutes,
  backToHomeRoutes,
  navigationRoutes,
  navigationRoutesValues,
} from "../../utils/navigationRoutes";
import { BackButton } from "./BackButton";
import { CloseDrawerButton } from "./CloseDrawerButton";
import { HeaderAppBar, HeaderControlsContainer } from "./Header.style";
import { SettingsButton, HistoryButton } from "./SettingsButton";
import { SplitWalletMenuButton } from "./WalletHeader";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";

export const NavigationHeader: React.FC = () => {
  const { subvariant, hiddenUI, variant } = useWidgetConfig();
  const { navigateBack } = useNavigateBack();
  const navigate = useNavigate();
  const { updateProduct } = useProduct();
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

  const isBackToHome = backToHomeRoutes.includes(`/${basePath}`);

  const splitSubvariant = subvariant === "split" && !hasPath;

  const goto = () => {
    if (isBackToHome) {
      navigate(navigationRoutes.home);
    } else {
      if (basePath === navigationRoutes.form.replace(/^\//, "")) {
        updateProduct(null);
      }
      navigateBack();
    }
  };

  const isStatusPage = cleanedPathname.startsWith(navigationRoutes.status);
  if (isStatusPage) {
    return null;
  }

  return (
    <>
      {(isBackButtonVisible || !hiddenUI?.includes(HiddenUI.Header)) && (
        <HeaderAppBar elevation={0}>
          {isBackButtonVisible && <BackButton onClick={goto} />}
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
                  <HistoryButton />
                  {!hiddenUI?.includes(HiddenUI.Header) && <SettingsButton />}
                  {variant === "drawer" &&
                  !hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (
                    <CloseDrawerButton header="navigation" />
                  ) : null}
                </HeaderControlsContainer>
              }
            />
            <Route
              path="*"
              element={element || <Box width={28} height={40} />}
            />
          </Routes>
        </HeaderAppBar>
      )}
    </>
  );
};
