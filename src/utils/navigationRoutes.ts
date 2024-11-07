export const navigationRoutes = {
    home: '/',
    activeTransactions: 'active-transactions',
    status: 'status',
    bridges: 'bridges',
    exchanges: 'exchanges',
    fromChain: 'from-chain',
    fromToken: 'from-token',
    languages: 'languages',
    routes: 'routes',
    settings: 'settings',
    transactionDetails: 'transaction-details',
    transactionExecution: 'transaction-execution',
    transactionHistory: 'transaction-history',
    bookmarks: 'bookmarks',
    recentWallets: 'recent-wallets',
    connectedWallets: 'connected-wallets',
    configuredWallets: 'configured-wallets',
  }
  
  export const navigationRoutesValues = Object.values(navigationRoutes)
  
  export const stickyHeaderRoutes = [
    navigationRoutes.activeTransactions,
    navigationRoutes.bridges,
    navigationRoutes.exchanges,
    navigationRoutes.fromChain,
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
    navigationRoutes.activeTransactions,
    navigationRoutes.bridges,
    navigationRoutes.exchanges,
    navigationRoutes.languages,
    navigationRoutes.fromChain,
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