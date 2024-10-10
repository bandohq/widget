// Reduced version for export-only usage
import type {
    ChainType,
    ContractCall,
    RouteExtended,
    RouteOptions,
    SDKConfig,
    StaticToken,
    Token,
} from '@lifi/sdk';
import type {
    Components,
    PaletteMode,
    PaletteOptions,
    Theme,
} from '@mui/material';
import type { TypographyOptions } from '@mui/material/styles/createTypography.js';
import type {
    CoinbaseWalletParameters,
    MetaMaskParameters,
    WalletConnectParameters,
} from '@wagmi/connectors';
  import type { CSSProperties, FC, MutableRefObject, RefObject } from 'react';
  
// Basic types
export type WidgetVariant = 'compact' | 'wide' | 'drawer';
export type WidgetSubvariant = 'default' | 'split' | 'custom' | 'refuel';
export type SplitSubvariant = 'bridge' | 'swap';
export type CustomSubvariant = 'checkout' | 'deposit';
export interface SubvariantOptions {
    split?: SplitSubvariant;
    custom?: CustomSubvariant;
}
  
// Appearance and theme configurations
export type Appearance = PaletteMode | 'auto';
export type WidgetThemeComponents = Pick<
  Components<Theme>,
    'MuiAppBar' | 'MuiAvatar' | 'MuiButton' | 'MuiCard' | 'MuiIconButton' | 'MuiInput' | 'MuiTabs'
>;

  
export type WidgetTheme = {
    palette?: Pick<PaletteOptions, 'background' | 'grey' | 'primary' | 'secondary' | 'text'>;
    typography?: TypographyOptions;
    components?: WidgetThemeComponents;
    container?: CSSProperties;
    header?: CSSProperties;
    playground?: CSSProperties;
};
  
// Enums for UI configuration
export enum DisabledUI {
    FromAmount = 'fromAmount',
    FromToken = 'fromToken',
    ToAddress = 'toAddress',
    ToToken = 'toToken',
}
export type DisabledUIType = `${DisabledUI}`;

export enum HiddenUI {
    Appearance = 'appearance',
    DrawerCloseButton = 'drawerCloseButton',
    History = 'history',
    Language = 'language',
    PoweredBy = 'poweredBy',
    ToAddress = 'toAddress',
    ToToken = 'toToken',
    WalletMenu = 'walletMenu',
    IntegratorStepDetails = 'integratorStepDetails',
}
export type HiddenUIType = `${HiddenUI}`;

export enum RequiredUI {
    ToAddress = 'toAddress',
}
export type RequiredUIType = `${RequiredUI}`;

// Wallet and SDK configuration types
export interface WidgetWalletConfig {
    onConnect?(): void;
    walletConnect?: WalletConnectParameters;
    coinbase?: CoinbaseWalletParameters;
    metaMask?: MetaMaskParameters;
}
  
export interface WidgetSDKConfig extends Omit<SDKConfig, 'apiKey' | 'disableVersionCheck' | 'integrator' | 'routeOptions' | 'widgetVersion'> {
    routeOptions?: Omit<RouteOptions, 'bridges' | 'exchanges'>;
}
  
// Fee calculation configuration
export interface WidgetFeeConfig {
    name?: string;
    logoURI?: string;
    fee?: number;
    calculateFee?(params: any): Promise<number | undefined>;
    _vcComponent: FC<{ route: RouteExtended }>;
}
  
// Widget chains, tokens, and address types
export interface ToAddress {
    name?: string;
    address: string;
    chainType: ChainType;
    logoURI?: string;
}
  
export type WidgetChains = {
    from?: any;
    to?: any;
    types?: any;
} & any;
  
export type WidgetTokens = {
    featured?: StaticToken[];
    include?: Token[];
    popular?: StaticToken[];
} & any;
  
export type WidgetConfig = {
    fromChain?: number;
    toChain?: number;
    fromToken?: string;
    toToken?: string;
    toAddress?: ToAddress;
    formUpdateKey?: string;
    contractCalls?: ContractCall[];
    integrator: string;
    apiKey?: string;
    fee?: number;
    feeConfig?: WidgetFeeConfig;
    variant?: WidgetVariant;
    subvariant?: WidgetSubvariant;
    appearance?: Appearance;
    theme?: WidgetTheme;
    disabledUI?: DisabledUIType[];
    hiddenUI?: HiddenUIType[];
    requiredUI?: RequiredUIType[];
    walletConfig?: WidgetWalletConfig;
    sdkConfig?: WidgetSDKConfig;
    chains?: WidgetChains;
    tokens?: WidgetTokens;
};
  
export interface WidgetConfigProps {
    config: WidgetConfig;
}
  
export type FormFieldOptions = { setUrlSearchParam: boolean };
export type FieldValues = { fromAmount?: number | string; toAmount?: number | string; toAddress?: ToAddress | string; };
export type FieldNames = keyof FieldValues;
export type SetFieldValueFunction = <K extends FieldNames>(key: K, value: FieldValues[K], options?: FormFieldOptions) => void;

export type FormState = { setFieldValue: SetFieldValueFunction };
export type FormRef = MutableRefObject<FormState | null>;
export interface FormRefProps { formRef?: FormRef; }
export interface WidgetConfigPartialProps { config?: Partial<WidgetConfig>; }
export interface WidgetDrawerProps extends WidgetConfigPartialProps {
    elementRef?: RefObject<HTMLDivElement>;
    open?: boolean;
    onClose?(): void;
}
  
export type WidgetProps = WidgetDrawerProps & WidgetConfig & WidgetConfigPartialProps & FormRefProps;
  