export const navigationRoutes = {
  home: '/',
  status: '/status',
  fromToken: '/from-token', 
  languages: 'languages',
  countries: 'countries',
  products: '/products',
  form: '/form',
  formSteps: '/form-steps',
  routes: '/routes',
  settings: '/settings',
};

  
  export const navigationRoutesValues = Object.values(navigationRoutes)
  
  export const stickyHeaderRoutes = [
    navigationRoutes.home,
    navigationRoutes.routes,
    navigationRoutes.settings,
  ]
  
  export const backButtonRoutes = [
    navigationRoutes.languages,
    navigationRoutes.form,
    navigationRoutes.fromToken,
    navigationRoutes.routes,
    navigationRoutes.settings,
    navigationRoutes.formSteps
  ]
  
  export type NavigationRouteTypeKeys = keyof typeof navigationRoutes
  
  export type NavigationRouteType =
    (typeof navigationRoutes)[NavigationRouteTypeKeys]