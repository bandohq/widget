import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { NotFound } from "./components/NotFound";
import { LanguagesPage } from "./pages/LanguagesPage";
import { MainPage } from "./pages/MainPage/MainPage.js";
import { SelectTokenPage } from "./pages/SelectTokenPage/SelectTokenPage.js";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";
import { navigationRoutes } from "./utils/navigationRoutes";
import { StatusPage } from "./pages/StatusPage/StatusPage";
import { ProductsPage } from "./pages/ProductsPage/ProductsPage";
import { CountryPage } from "./pages/CountryPage";
import { CategoryPage } from "./pages/ProductsPage/CategoryPage/CategoryPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: navigationRoutes.products,
    element: <ProductsPage />,
  },
  {
    path: navigationRoutes.settings,
    element: <SettingsPage />,
  },
  {
    path: navigationRoutes.status,
    element: <StatusPage />,
  },
  {
    path: `${navigationRoutes.products}`,
    element: <ProductsPage />,
  },
  {
    path: `${navigationRoutes.products}/:category`,
    element: <CategoryPage />,
  },
  {
    path: `${navigationRoutes.settings}/${navigationRoutes.languages}`,
    element: <LanguagesPage />,
  },
  {
    path: `${navigationRoutes.settings}/${navigationRoutes.countries}`,
    element: <CountryPage />,
  },
  {
    path: navigationRoutes.fromToken,
    element: <SelectTokenPage formType="from" />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};
