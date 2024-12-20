export const navigationRoutes = {
  home: '/',
  status: '/status',
  buyForm: '/buy-form',
  fromToken: '/from-token', 
  languages: '/languages',
  countries: '/countries',
  products: '/products',
  form: '/form',
  routes: '/routes',
  settings: '/settings',
  transactionDetails: '/transaction-details',
  transactionExecution: '/transaction-execution',
  transactionHistory: '/transaction-history',
  bookmarks: '/bookmarks',
  recentWallets: '/recent-wallets',
  connectedWallets: '/connected-wallets',
  configuredWallets: '/configured-wallets',
};

  
  export const navigationRoutesValues = Object.values(navigationRoutes)
  
  export const stickyHeaderRoutes = [
    navigationRoutes.home,
    navigationRoutes.routes,
    navigationRoutes.settings,
    navigationRoutes.transactionDetails,
    navigationRoutes.transactionExecution,
    navigationRoutes.transactionHistory,
    navigationRoutes.bookmarks,
    navigationRoutes.recentWallets,
    navigationRoutes.connectedWallets,
    navigationRoutes.configuredWallets,
  ]
  
  export const backButtonRoutes = [
    navigationRoutes.languages,
    navigationRoutes.form,
    navigationRoutes.fromToken,
    navigationRoutes.routes,
    navigationRoutes.settings,
    navigationRoutes.transactionDetails,
    navigationRoutes.transactionExecution,
    navigationRoutes.transactionHistory,
    navigationRoutes.bookmarks,
    navigationRoutes.recentWallets,
    navigationRoutes.connectedWallets,
    navigationRoutes.configuredWallets,
  ]
  
  export type NavigationRouteTypeKeys = keyof typeof navigationRoutes
  
  export type NavigationRouteType =
    (typeof navigationRoutes)[NavigationRouteTypeKeys]