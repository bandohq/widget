import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { NotFound } from "./components/NotFound";
import { LanguagesPage } from "./pages/LanguagesPage";
import { FormPage } from "./pages/FormPage/FormPage.js";
import { SelectTokenPage } from "./pages/SelectTokenPage/SelectTokenPage.js";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";
import { navigationRoutes } from "./utils/navigationRoutes";
import { StatusPage } from "./pages/StatusPage/StatusPage";
import { ProductsPage } from "./pages/ProductsPage/ProductsPage";
import { CategoryPage } from "./pages/ProductsPage/CategoryPage/CategoryPage";
import { FormsStepsPage } from "./pages/FormStepsPage/FormsStepsPage";
import { TransactionsHistoryPage } from "./pages/TransactionHistory/TransactionHistory";
import { TransactionsDetailPage } from "./pages/TransactionHistory/TransactionDetail";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <ProductsPage />,
  },
  {
    path: navigationRoutes.form,
    element: <FormPage />,
  },
  {
    path: navigationRoutes.formSteps,
    element: <FormsStepsPage />,
  },
  {
    path: navigationRoutes.settings,
    element: <SettingsPage />,
  },
  {
    path: navigationRoutes.transactionHistory,
    element: <TransactionsHistoryPage />,
  },
  {
    path: `${navigationRoutes.transactionDetail}/:transactionId`,
    element: <TransactionsDetailPage />,
  },
  {
    path: navigationRoutes.fromToken,
    element: <SelectTokenPage formType="from" />,
  },
  {
    path: `${navigationRoutes.status}/:transactionId`,
    element: <StatusPage />,
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
    path: "*",
    element: <NotFound />,
  },
];

export const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};
