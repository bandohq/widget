import { useMemo } from 'react';
import { useConnect, useAccount as useWagmiAccount } from 'wagmi';
import { createCoinbaseConnector, createMetaMaskConnector, createWalletConnectConnector, getWalletPriority } from '@lifi/wallet-management';
import { useWallet } from '@solana/wallet-adapter-react';
import { defaultCoinbaseConfig } from '../config/coinbase';
import { defaultMetaMaskConfig } from '../config/metaMask';
import { defaultWalletConnectConfig } from '../config/walletConnect';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { WidgetWalletConfig } from '../types/widget';
import { useMediaQuery } from '@mui/material';
import { ChainType } from '../pages/SelectChainPage/types';

/**
 * Custom hook to filter and sort wallets based on the provided configuration and chain types.
 * 
 * @param walletConfig The wallet configuration object containing MetaMask, WalletConnect, and Coinbase configurations.
 * @param chains An array of CustomChainType values to filter the wallets based on chain types.
 * @returns An array of sorted and filtered wallets based on the provided configuration and chain types.
 */
export const useWallets = (walletConfig?: WidgetWalletConfig, chains?: ChainType[]) => {
  const account = useWagmiAccount();
  const { connectors } = useConnect();
  const { wallets: solanaWallets } = useWallet();
  const isDesktopView = useMediaQuery('(min-width:600px)');

  const wallets = useMemo(() => {
    const evmConnectors = [
      createMetaMaskConnector(walletConfig?.metaMask ?? defaultMetaMaskConfig),
      createWalletConnectConnector(walletConfig?.walletConnect ?? defaultWalletConnectConfig),
      createCoinbaseConnector(walletConfig?.coinbase ?? defaultCoinbaseConfig),
    ];

    // filter installed wallets based on chain type
    const evmInstalled = chains?.includes(ChainType.EVM)
      ? evmConnectors.filter(
          (connector) => connector.id && account.connector?.id !== connector.id,
        )
      : [];
    
    const evmNotDetected = chains?.includes(ChainType.EVM)
      ? evmConnectors.filter((connector) => !connector.id)
      : [];

    const svmInstalled = chains?.includes(ChainType.SVM)
      ? solanaWallets?.filter(
          (connector) =>
            connector.adapter.readyState === WalletReadyState.Installed &&
            !connector.adapter.connected,
        )
      : [];
    
    const svmNotDetected = chains?.includes(ChainType.SVM)
      ? solanaWallets?.filter(
          (connector) =>
            connector.adapter.readyState !== WalletReadyState.Installed,
        )
      : [];

    const installedWallets = [...evmInstalled, ...svmInstalled].sort(walletComparator);

    // Add wallets not detected when not in desktop view
    if (isDesktopView) {
      const notDetectedWallets = [...evmNotDetected, ...svmNotDetected].sort(walletComparator);
      installedWallets.push(...notDetectedWallets);
    }

    return installedWallets;
  }, [account.connector?.id, chains, connectors, isDesktopView, solanaWallets, walletConfig]);

  return wallets;
};

export const walletComparator = (a, b) => {
  const aId = a.id || a.adapter?.name;
  const bId = b.id || b.adapter?.name;

  const priorityA = getWalletPriority(aId);
  const priorityB = getWalletPriority(bId);

  return priorityA !== priorityB ? priorityA - priorityB : aId.localeCompare(bId);
};
