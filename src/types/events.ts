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
  ContactSupport = 'contactSupport',
  SourceChainTokenSelected = 'sourceChainTokenSelected',
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
  NoTokensAvailable = 'noTokensAvailable',
  InsufficientBalance = 'insufficientBalance',
}

// Mocking the widget events type
export type WidgetEvents = {
  contactSupport: ContactSupport;
  sourceChainTokenSelected: ChainTokenSelected;
  formFieldChanged: FormFieldChanged;
  reviewTransactionPageEntered?: Route;
  walletConnected: WalletConnected;
  widgetExpanded: boolean;
  pageEntered: NavigationRouteType;
  settingUpdated: SettingUpdated;
  noTokensAvailable: NoTokensAvailable;
  insufficientBalance: InsufficientBalance;
};

// Mocking the interfaces
export interface ContactSupport {
  supportId?: string;
}

export interface ChainTokenSelected {
  chainId: ChainId;
  tokenAddress: string;
}

export interface NoTokensAvailable {
  chainId: ChainId;
}

export interface InsufficientBalance {
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
