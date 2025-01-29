import type { MetaMaskParameters } from 'wagmi/connectors';
import { BandoLogo }  from '../assets/BandoLogo.js';

export const defaultMetaMaskConfig: MetaMaskParameters = {
  dappMetadata: {
    name: 'Bando.cool',
    url:
      typeof window !== 'undefined'
        ? (window as Window)?.location.href
        : 'https://bando.cool/',
    base64Icon: BandoLogo,
  },
};