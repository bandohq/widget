import type {
    Components,
    PaletteMode,
    PaletteOptions,
    Shape,
    Theme,
  } from '@mui/material'
  import type { TypographyOptions } from '@mui/material/styles/createTypography.js'
  import type {
    CSSProperties,
    FC,
    // MutableRefObject,
    ReactNode,
    RefObject,
  } from 'react'
  import type {
    CoinbaseWalletParameters,
    MetaMaskParameters,
    WalletConnectParameters,
  } from 'wagmi/connectors'
//   import type {
//     LanguageKey,
//     LanguageResources,
//   } from '../providers/I18nProvider/types.js'
//   import type { DefaultFieldValues } from '../stores/form/types.js'
  
  // mocked lifi structures
  
  export enum ChainType {
    EVM = 'EVM',
    SVM = 'SVM',
    UTXO = 'UTXO',
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
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
  }
  
  export interface Token extends StaticToken {
    name?: string;
    logoURI?: string;
  }
  
  export type WidgetVariant = 'compact' | 'drawer'
  export type WidgetSubvariant = 'default' | 'split' | 'custom' | 'refuel'
  export type SplitSubvariant = 'bridge' | 'swap'
  export type CustomSubvariant = 'checkout' | 'deposit'
  export interface SubvariantOptions {
    split?: SplitSubvariant
    custom?: CustomSubvariant
  }
  
  export type Appearance = PaletteMode | 'auto'
  export interface NavigationProps {
    edge?: boolean
  }
  
  export type WidgetThemeComponents = Pick<
    Components<Theme>,
    | 'MuiAppBar'
    | 'MuiAvatar'
    | 'MuiButton'
    | 'MuiCard'
    | 'MuiIconButton'
    | 'MuiInput'
    | 'MuiTabs'
  >
  
  export type WidgetTheme = {
    palette?: Pick<
      PaletteOptions,
      'background' | 'grey' | 'primary' | 'secondary' | 'text'
    >
    shape?: Partial<Shape>
    typography?: TypographyOptions
    components?: WidgetThemeComponents
    container?: CSSProperties
    header?: CSSProperties
    playground?: CSSProperties
    navigation?: NavigationProps
  }
  
  export enum DisabledUI {
    FromAmount = 'fromAmount',
    FromToken = 'fromToken',
    ToAddress = 'toAddress',
    ToToken = 'toToken',
  }
  export type DisabledUIType = `${DisabledUI}`
  
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
  export type HiddenUIType = `${HiddenUI}`
  
  export enum RequiredUI {
    ToAddress = 'toAddress',
  }
  export type RequiredUIType = `${RequiredUI}`
  
  export interface WidgetWalletConfig {
    onConnect?(): void
    walletConnect?: WalletConnectParameters
    coinbase?: CoinbaseWalletParameters
    metaMask?: MetaMaskParameters
  }

  
  export interface WidgetContractTool {
    name: string
    logoURI: string
  }
  
  export interface CalculateFeeParams {
    fromChainId: number
    toChainId: number
    fromTokenAddress: string
    toTokenAddress: string
    fromAddress?: string
    toAddress?: string
    fromAmount: bigint
    slippage: number
  }
  
  export interface WidgetFeeConfig {
    name?: string
    logoURI?: string
    fee?: number
    calculateFee?(params: CalculateFeeParams): Promise<number | undefined>
    _vcComponent: FC<{ route: RouteExtended }>
  }
  
  export interface ToAddress {
    name?: string
    address: string
    chainType: ChainType
    logoURI?: string
  }
  
  export interface AllowDeny<T> {
    allow?: T[]
    deny?: T[]
  }
  
  export type WidgetChains = {
    from?: AllowDeny<number>
    to?: AllowDeny<number>
    types?: AllowDeny<ChainType>
  } & AllowDeny<number>
  
  export type WidgetTokens = {
    featured?: StaticToken[]
    include?: Token[]
    popular?: StaticToken[]
  } & AllowDeny<Token>
  
//   export type WidgetLanguages = {
//     default?: LanguageKey
//   } & AllowDeny<LanguageKey>
  
  export interface WidgetConfig {
    fromChain?: number
    toChain?: number
    fromToken?: string
    toToken?: string
    toAddress?: ToAddress
    toAddresses?: ToAddress[]
    fromAmount?: number | string
    toAmount?: number | string
    formUpdateKey?: string
    contractCalls?: ContractCall[]
    contractComponent?: ReactNode
    contractSecondaryComponent?: ReactNode
    contractCompactComponent?: ReactNode
    contractTool?: WidgetContractTool
    integrator: string
    apiKey?: string
    fee?: number
    feeConfig?: WidgetFeeConfig
    referrer?: string
    // routePriority?: Order
    slippage?: number
    variant?: WidgetVariant
    subvariant?: WidgetSubvariant
    subvariantOptions?: SubvariantOptions
    appearance?: Appearance
    theme?: WidgetTheme
    disabledUI?: DisabledUIType[]
    hiddenUI?: HiddenUIType[]
    requiredUI?: RequiredUIType[]
    useRecommendedRoute?: boolean
    walletConfig?: WidgetWalletConfig
    buildUrl?: boolean
    keyPrefix?: string
    bridges?: AllowDeny<string>
    exchanges?: AllowDeny<string>
    chains?: WidgetChains
    tokens?: WidgetTokens
    // languages?: WidgetLanguages
    // languageResources?: LanguageResources
    explorerUrls?: Record<number, string[]> &
      Partial<Record<'internal', string[]>>
  }
  
  export interface FormFieldOptions {
    setUrlSearchParam: boolean
  }
  
//   export interface FieldValues
//     extends Omit<DefaultFieldValues, 'fromAmount' | 'toAmount' | 'toAddress'> {
//     fromAmount?: number | string
//     toAmount?: number | string
//     toAddress?: ToAddress | string
//   }
  
//   export type FieldNames = keyof FieldValues
  
//   export type SetFieldValueFunction = <K extends FieldNames>(
//     key: K,
//     value: FieldValues[K],
//     options?: FormFieldOptions
//   ) => void
  
//   export type FormState = {
//     setFieldValue: SetFieldValueFunction
//   }
  
//   export type FormRef = MutableRefObject<FormState | null>
  
//   export interface FormRefProps {
//     formRef?: FormRef
//   }
  
//   export interface WidgetConfigProps extends FormRefProps {
//     config: WidgetConfig
//   }
  
  export interface WidgetConfigPartialProps {
    config?: Partial<WidgetConfig>
  }
  
  export type WidgetProps = WidgetDrawerProps &
    WidgetConfig &
    WidgetConfigPartialProps 
    // FormRefProps
  
  export interface WidgetDrawerProps extends WidgetConfigPartialProps {
    elementRef?: RefObject<HTMLDivElement>
    open?: boolean
    onClose?(): void
  }
  