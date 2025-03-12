export const navigationRoutes = {
  home: "/",
  status: "/status",
  fromToken: "/from-token",
  languages: "languages",
  countries: "countries",
  transactionHistory: "/transaction-history",
  transactionDetail: "/transaction-detail",
  products: "/products",
  form: "/form",
  formSteps: "/form-steps",
  settings: "/settings",
};

  
  export const navigationRoutesValues = Object.values(navigationRoutes)
  
  export const stickyHeaderRoutes = [
    navigationRoutes.home,
    navigationRoutes.settings,
  ]
  
  export const backButtonRoutes = [
    navigationRoutes.languages,
    navigationRoutes.form,
    navigationRoutes.fromToken,
    navigationRoutes.settings,
    navigationRoutes.transactionHistory,
    navigationRoutes.transactionDetail,
  ];

  export const backToHomeRoutes = [navigationRoutes.transactionHistory];
  
  export type NavigationRouteTypeKeys = keyof typeof navigationRoutes
  
  export type NavigationRouteType =
    (typeof navigationRoutes)[NavigationRouteTypeKeys]