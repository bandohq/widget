import type {
  Components,
  PaletteMode,
  PaletteOptions,
  Shape,
  Theme,
} from "@mui/material";
import type { TypographyOptions } from "@mui/material/styles/createTypography.js";
import type {
  CSSProperties,
  FC,
  MutableRefObject,
  ReactNode,
  RefObject,
} from "react";
import type {
  CoinbaseWalletParameters,
  MetaMaskParameters,
  WalletConnectParameters,
} from "wagmi/connectors";
import type {
  LanguageKey,
  LanguageResources,
} from "../providers/I18nProvider/types.js";
import type { DefaultFieldValues } from "../stores/form/types";
import { Address, ChainType } from "../pages/SelectChainPage/types.js";

export type PayCommandInput = {
  reference: string;
  to: string;
  tokens: Array<{
    symbol: string;
    token_amount: string;
  }>;
  description: string;
};

export type PayCommandResponse = {
  finalPayload: {
    status: string;
    error_code?: string;
  };
};

// Commands from world minikit-js library
export interface CommandsAsync {
  pay: (payload: PayCommandInput) => Promise<PayCommandResponse>;
}

// TransactionProvider from world minikit-js library
export interface TransactionProvider {
  isInstalled: () => boolean | Promise<boolean>;
  commandsAsync: CommandsAsync;
  user?: { id?: string; walletAddress?: `0x${string}` } | undefined;
}

export interface ContractCall {
  target: string;
  callData: string;
  value?: number;
}

export interface RouteExtended {
  id: string;
  steps: any[];
}

export interface RouteOptions {
  slippage?: number;
  timeout?: number;
}

export interface SDKConfig {
  apiKey?: string;
  disableVersionCheck?: boolean;
  integrator?: string;
  widgetVersion?: string;
}

export interface StaticToken {
  address: Address;
  symbol: string;
  decimals: number;
  chainId: number;
}

export interface Token extends StaticToken {
  name?: string;
  logoURI?: string;
}

export type WidgetVariant = "compact" | "drawer";
export type WidgetSubvariant = "default" | "split" | "custom" | "refuel";
export type CustomSubvariant = "checkout" | "deposit";
export interface SubvariantOptions {
  custom?: CustomSubvariant;
}

export type Appearance = PaletteMode | "auto";
export interface NavigationProps {
  edge?: boolean;
}

export type WidgetThemeComponents = Pick<
  Components<Theme>,
  | "MuiAppBar"
  | "MuiAvatar"
  | "MuiButton"
  | "MuiCard"
  | "MuiIconButton"
  | "MuiInput"
  | "MuiTabs"
>;

export type WidgetTheme = {
  palette?: Pick<
    PaletteOptions,
    "background" | "grey" | "primary" | "secondary" | "text"
  >;
  shape?: Partial<Shape>;
  typography?: TypographyOptions;
  components?: WidgetThemeComponents;
  container?: CSSProperties;
  header?: CSSProperties;
  playground?: CSSProperties;
  navigation?: NavigationProps;
};

export enum DisabledUI {
  FromAmount = "fromAmount",
  FromToken = "fromToken",
}
export type DisabledUIType = `${DisabledUI}`;

export enum HiddenUI {
  Appearance = "appearance",
  DrawerCloseButton = "drawerCloseButton",
  History = "history",
  Language = "language",
  PoweredBy = "poweredBy",
  countries = "countries",
  WalletMenu = "walletMenu",
  IntegratorStepDetails = "integratorStepDetails",
  Header = "header",
}
export type HiddenUIType = `${HiddenUI}`;

export interface WidgetWalletConfig {
  onConnect?(): void;
  walletConnect?: WalletConnectParameters;
  coinbase?: CoinbaseWalletParameters;
  metaMask?: MetaMaskParameters;
  /**
   * Determines whether the widget should provide partial wallet management functionality.
   *
   * In partial mode, external wallet management will be used for "opt-out" providers,
   * while the internal management is applied for any remaining providers that do not opt out.
   * This allows a flexible balance between the integrator’s custom wallet menu and the widget’s native wallet menu.
   * @default false
   */
  usePartialWalletManagement?: boolean;
}

export interface WidgetContractTool {
  name: string;
  logoURI: string;
}

export interface CalculateFeeParams {
  fromChainId: number;
  toChainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  fromAddress?: string;
  fromAmount: bigint;
  slippage: number;
}

export interface WidgetFeeConfig {
  name?: string;
  logoURI?: string;
  fee?: number;
  calculateFee?(params: CalculateFeeParams): Promise<number | undefined>;
  _vcComponent: FC<{ route: RouteExtended }>;
}

export interface AllowDeny<T> {
  allow?: T[];
  deny?: T[];
}

export type WidgetChains = {
  from?: AllowDeny<number>;
  to?: AllowDeny<number>;
  types?: AllowDeny<ChainType>;
} & AllowDeny<number>;

export type WidgetTokens = {
  featured?: StaticToken[];
  include?: Token[];
  popular?: StaticToken[];
} & AllowDeny<Token>;

export type WidgetLanguages = {
  default?: LanguageKey;
} & AllowDeny<LanguageKey>;

export interface WidgetConfig {
  fromChain?: number;
  fromToken?: string;
  productId?: string;
  country?: string;
  allowedCountries?: string[];
  toAmount?: number | string;
  formUpdateKey?: string;

  contractCalls?: ContractCall[];
  contractComponent?: ReactNode;
  contractSecondaryComponent?: ReactNode;
  contractCompactComponent?: ReactNode;
  contractTool?: WidgetContractTool;
  integrator: string;
  apiKey?: string;
  /**
   * @deprecated Use `feeConfig` instead.
   */
  fee?: number;
  feeConfig?: WidgetFeeConfig;
  referrer?: string;

  slippage?: number;

  variant?: WidgetVariant;
  subvariant?: WidgetSubvariant;
  subvariantOptions?: SubvariantOptions;

  appearance?: Appearance;
  theme?: WidgetTheme;

  disabledUI?: DisabledUIType[];
  hiddenUI?: HiddenUIType[];
  useRecommendedRoute?: boolean;

  walletConfig?: WidgetWalletConfig;
  transactionProvider?: TransactionProvider;

  buildUrl?: boolean;
  keyPrefix?: string;

  chains?: WidgetChains;
  tokens?: WidgetTokens;
  languages?: WidgetLanguages;
  languageResources?: LanguageResources;
  explorerUrls?: Record<number, string[]> &
    Partial<Record<"internal", string[]>>;
}

export interface FormFieldOptions {
  setUrlSearchParam: boolean;
}

export interface FieldValues
  extends Omit<DefaultFieldValues, "fromAmount" | "toAmount"> {
  fromAmount?: number | string;
}

export type FieldNames = keyof FieldValues;

export type SetFieldValueFunction = <K extends FieldNames>(
  key: K,
  value: FieldValues[K],
  options?: FormFieldOptions
) => void;

export type FormState = {
  setFieldValue: SetFieldValueFunction;
};

export type FormRef = MutableRefObject<FormState | null>;

export interface FormRefProps {
  formRef?: FormRef;
}

export interface WidgetConfigProps extends FormRefProps {
  config: WidgetConfig;
}

export interface WidgetConfigPartialProps {
  config?: Partial<WidgetConfig>;
}

export type WidgetProps = WidgetDrawerProps &
  WidgetConfig &
  WidgetConfigPartialProps &
  FormRefProps;

export interface WidgetDrawerProps extends WidgetConfigPartialProps {
  elementRef?: RefObject<HTMLDivElement>;
  open?: boolean;
  /**
   * Make sure to make the onClose callback stable (e.g. using useCallback) to avoid causing re-renders of the entire widget
   */
  onClose?(): void;
}
