import { CoinKey } from "../SelectChainPage/types"

export enum TokenFilterType {
  My = 0,
  All = 1,
}

export interface BaseToken {
  chainId: ChainId
  address: string
}

export interface StaticToken extends BaseToken {
  symbol: string
  decimals: number
  name: string
  coinKey?: CoinKey
  imageUrl?: string
}

export interface Token extends StaticToken {
  priceUSD: string
}

export interface TokenAmount extends Token {
  balance?: bigint
  amount?: bigint
  blockNumber?: bigint
}

export enum ChainKey {
  // EVM
  ETH = 'eth',
  POL = 'pol',
  BSC = 'bsc',
  DAI = 'dai',
  FTM = 'ftm',
  AVA = 'ava',
  ARB = 'arb',
  OPT = 'opt',
  ONE = 'one',
  FSN = 'fsn',
  MOR = 'mor',
  CEL = 'cel',
  FUS = 'fus',
  TLO = 'tlo',
  CRO = 'cro',
  BOB = 'bob',
  RSK = 'rsk',
  VEL = 'vel',
  MOO = 'moo',
  MAM = 'mam',
  AUR = 'aur',
  EVM = 'evm',
  ARN = 'arn',
  ERA = 'era',
  PZE = 'pze',
  LNA = 'lna',
  BAS = 'bas',
  SCL = 'scl',
  MOD = 'mod',
  MNT = 'mnt',
  BLS = 'bls',
  SEI = 'sei',
  FRA = 'fra',
  TAI = 'tai',
  GRA = 'gra',
  IMX = 'imx',
  KAI = 'kai',
  XLY = 'xly',
  OPB = 'opb',

  // None-EVM
  SOL = 'sol',
  TER = 'ter',
  OAS = 'oas',

  // UTXO
  BTC = 'btc',
  BCH = 'bch',
  LTC = 'ltc',
  DGE = 'dge',
}

export enum ChainId {
  ETH = 1,
  POL = 137,
  BSC = 56,
  DAI = 100,
  FTM = 250,
  AVA = 43114,
  ARB = 42161,
  OPT = 10,
  ONE = 1666600000,
  FSN = 32659,
  MOR = 1285,
  CEL = 42220,
  FUS = 122,
  TLO = 40,
  CRO = 25,
  BOB = 288,
  RSK = 30,
  VEL = 106,
  MOO = 1284,
  MAM = 1088,
  AUR = 1313161554,
  EVM = 9001,
  ARN = 42170,
  ERA = 324,
  PZE = 1101,
  LNA = 59144,
  BAS = 8453,
  SCL = 534352,
  MOD = 34443,
  MNT = 5000,
  BLS = 81457,
  SEI = 1329,
  FRA = 252,
  TAI = 167000,
  GRA = 1625,
  IMX = 13371,
  KAI = 8217,
  XLY = 196,
  OPB = 204,
}