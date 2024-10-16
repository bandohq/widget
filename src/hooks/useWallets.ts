import { useMemo } from 'react';
import { useConnect, useAccount as useWagmiAccount } from 'wagmi';
import { createCoinbaseConnector, createMetaMaskConnector, createWalletConnectConnector, getWalletPriority } from '@lifi/wallet-management';
import { useWallet } from '@solana/wallet-adapter-react';
import { defaultCoinbaseConfig } from '../config/coinbase';
import { defaultMetaMaskConfig } from '../config/metaMask';
import { defaultWalletConnectConfig } from '../config/walletConnect';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { WidgetChains, WidgetWalletConfig } from '../types/widget';

export const useWallets = (walletConfig?: WidgetWalletConfig, chains: WidgetChains) => {
  const account = useWagmiAccount();
  const { connectors } = useConnect();
  const { wallets: solanaWallets } = useWallet();

  const wallets = useMemo(() => {
    const evmConnectors = [
      createMetaMaskConnector(walletConfig?.metaMask ?? defaultMetaMaskConfig),
      createWalletConnectConnector(walletConfig?.walletConnect ?? defaultWalletConnectConfig),
      createCoinbaseConnector(walletConfig?.coinbase ?? defaultCoinbaseConfig),
    ];

    const evmInstalled = evmConnectors.filter(
      (connector) => connector.id && account.connector?.id !== connector.id,
    );
    const svmInstalled = solanaWallets?.filter(
      (connector) => connector.adapter.readyState === WalletReadyState.Installed && !connector.adapter.connected,
    );

    return [...evmInstalled, ...svmInstalled].sort(walletComparator);
  }, [account.connector?.id, connectors, solanaWallets, walletConfig]);

  return wallets;
};

export const walletComparator = (a, b) => {
  const aId = a.id || a.adapter?.name;
  const bId = b.id || b.adapter?.name;

  const priorityA = getWalletPriority(aId);
  const priorityB = getWalletPriority(bId);

  return priorityA !== priorityB ? priorityA - priorityB : aId.localeCompare(bId);
};
