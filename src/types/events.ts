import { ChainType } from "../pages/SelectChainPage/types";

// Mocked Enums and Types (to replace dependencies)
export type ChainId = number; // Simulates ChainId
export type Process = unknown; // Generic type, non-functional
export type Route = unknown; // Generic type, non-functional
export type DefaultValues = Record<string, unknown>; // Simulates DefaultValues
export type SettingsProps = Record<string, unknown>; // Simulates SettingsProps
export type NavigationRouteType = string; // Simulates NavigationRouteType

// Keep the enum and events as they were
export enum WidgetEvent {
  RouteExecutionStarted = 'routeExecutionStarted',
  RouteExecutionUpdated = 'routeExecutionUpdated',
  RouteExecutionCompleted = 'routeExecutionCompleted',
  RouteExecutionFailed = 'routeExecutionFailed',
  RouteHighValueLoss = 'routeHighValueLoss',
  AvailableRoutes = 'availableRoutes',
  ContactSupport = 'contactSupport',
  SourceChainTokenSelected = 'sourceChainTokenSelected',
  DestinationChainTokenSelected = 'destinationChainTokenSelected',
  QuoteFetched = 'quoteFetched',
  /**
   * @deprecated Use `PageEntered` event instead.
   */
  ReviewTransactionPageEntered = 'reviewTransactionPageEntered',
  WalletConnected = 'walletConnected',
  WidgetExpanded = 'widgetExpanded',
  PageEntered = 'pageEntered',
  FormFieldChanged = 'formFieldChanged',
  SettingUpdated = 'settingUpdated',
}

// Mocking the widget events type
export type WidgetEvents = {
  routeExecutionStarted: Route;
  routeExecutionUpdated: RouteExecutionUpdate;
  routeExecutionCompleted: Route;
  routeExecutionFailed: RouteExecutionUpdate;
  routeHighValueLoss: RouteHighValueLossUpdate;
  availableRoutes: Route[];
  contactSupport: ContactSupport;
  sourceChainTokenSelected: ChainTokenSelected;
  destinationChainTokenSelected: ChainTokenSelected;
  formFieldChanged: FormFieldChanged;
  reviewTransactionPageEntered?: Route;
  walletConnected: WalletConnected;
  widgetExpanded: boolean;
  pageEntered: NavigationRouteType;
  settingUpdated: SettingUpdated;
};

// Mocking the interfaces
export interface ContactSupport {
  supportId?: string;
}

export interface RouteHighValueLossUpdate {
  fromAmountUSD: number;
  toAmountUSD: number;
  gasCostUSD?: number;
  feeCostUSD?: number;
  valueLoss: number;
}

export interface RouteExecutionUpdate {
  route: Route;
  process: Process;
}

export interface ChainTokenSelected {
  chainId: ChainId;
  tokenAddress: string;
}

export interface WalletConnected {
  address?: string;
  chainId?: number;
  chainType?: ChainType;
}

export type FormFieldChanged = {
  [K in keyof DefaultValues]: {
    fieldName: K;
    newValue: DefaultValues[K];
    oldValue: DefaultValues[K];
  };
}[keyof DefaultValues];

export type SettingUpdated<
  K extends keyof SettingsProps = keyof SettingsProps,
> = {
  setting: K;
  newValue: SettingsProps[K];
  oldValue: SettingsProps[K];
  newSettings: SettingsProps;
  oldSettings: SettingsProps;
};
