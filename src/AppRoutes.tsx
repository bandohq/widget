import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { NotFound } from "./components/NotFound";
// import { ActiveTransactionsPage } from "./pages/ActiveTransactionsPage/ActiveTransactionsPage.js";
// import { LanguagesPage } from "./pages/LanguagesPage.js";
import { MainPage } from "./pages/MainPage/MainPage.js";
// import { RoutesPage } from "./pages/RoutesPage/RoutesPage.js";
// import { SelectChainPage } from "./pages/SelectChainPage/SelectChainPage.js";
// import { SelectEnabledToolsPage } from "./pages/SelectEnabledToolsPage.js";
// import { SelectTokenPage } from "./pages/SelectTokenPage/SelectTokenPage.js";
// import { SendToConfiguredWalletPage } from "./pages/SendToWallet/SendToConfiguredWalletPage.js";
// import { SettingsPage } from "./pages/SettingsPage/SettingsPage.js";
// import { TransactionDetailsPage } from "./pages/TransactionDetailsPage/TransactionDetailsPage.js";
// import { TransactionHistoryPage } from "./pages/TransactionHistoryPage/TransactionHistoryPage.js";
// import { TransactionPage } from "./pages/TransactionPage/TransactionPage.js"
import { navigationRoutes } from "./utils/navigationRoutes";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainPage />,
  },
  // {
  //   path: navigationRoutes.settings,
  //   element: <SettingsPage />,
  // },
  // {
  //   path: `${navigationRoutes.settings}/${navigationRoutes.bridges}`,
  //   element: <SelectEnabledToolsPage type="Bridges" />,
  // },
  // {
  //   path: `${navigationRoutes.settings}/${navigationRoutes.exchanges}`,
  //   element: <SelectEnabledToolsPage type="Exchanges" />,
  // },
  // {
  //   path: `${navigationRoutes.settings}/${navigationRoutes.languages}`,
  //   element: <LanguagesPage />,
  // },
  // {
  //   path: navigationRoutes.fromToken,
  //   element: <SelectTokenPage formType="from" />,
  // },
  // {
  //   path: `${navigationRoutes.fromToken}?/${navigationRoutes.fromChain}`,
  //   element: <SelectChainPage formType="from" />,
  // },
  // {
  //   path: navigationRoutes.routes,
  //   element: <RoutesPage />,
  // },
  // {
  //   path: navigationRoutes.activeTransactions,
  //   element: <ActiveTransactionsPage />,
  // },
  // {
  //   path: navigationRoutes.configuredWallets,
  //   element: <SendToConfiguredWalletPage />,
  // },
  // {
  //   path: navigationRoutes.transactionHistory,
  //   element: <TransactionHistoryPage />,
  // },
  // {
  //   path: `${navigationRoutes.transactionHistory}?/${navigationRoutes.routes}?/${navigationRoutes.transactionExecution}?/${navigationRoutes.transactionDetails}`,
  //   element: <TransactionDetailsPage />,
  // },
  // {
  //   path: `${navigationRoutes.routes}?/${navigationRoutes.activeTransactions}?/${navigationRoutes.transactionExecution}`,
  //   element: <TransactionPage />,
  // },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};
