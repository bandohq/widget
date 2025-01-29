import type { CoinbaseWalletParameters } from 'wagmi/connectors';
import { BandoLogo } from '../assets/BandoLogo.js';

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: 'Bando.cool',
  appLogoUrl: BandoLogo,
};