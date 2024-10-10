import type { CoinbaseWalletParameters } from 'wagmi/connectors';
import Bandologo from '../assets/Bandologo.svg';

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: 'Bando.cool',
  appLogoUrl: Bandologo,
};