import type { Account } from '@lifi/wallet-management';
import {
  getConnectorIcon,
  useAccount,
  useWalletMenu,
} from '@lifi/wallet-management';
import { ExpandMore, Wallet } from '@mui/icons-material';
import { Avatar, Badge } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChain } from '../../hooks/useChain';
import { useExternalWalletProvider } from '../../providers/WalletProvider/useExternalWalletProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider';
import { useFieldValues } from '../../stores/form/useFieldValues';
import { HiddenUI } from '../../types/widget';
import { SmallAvatar } from '../Avatar/SmallAvatar';
import { CloseDrawerButton } from './CloseDrawerButton';
import {
  DrawerWalletContainer,
  HeaderAppBar,
  WalletAvatar,
  WalletButton,
} from './Header.style.js';
import { WalletMenuContainer } from './WalletMenu.style';
import { WalletMenu } from './WalletMenu';
import { shortenAddress } from '../../utils/wallet';

export const WalletHeader: React.FC = () => {
  const { subvariant, hiddenUI } = useWidgetConfig();
  const { useExternalWalletProvidersOnly } = useExternalWalletProvider();
  return !useExternalWalletProvidersOnly &&
    subvariant !== 'split' &&
    !hiddenUI?.includes(HiddenUI.WalletMenu) ? (
    <HeaderAppBar elevation={0} sx={{ justifyContent: 'flex-end' }}>
      <WalletMenuButton />
    </HeaderAppBar>
  ) : null;
};

export const SplitWalletMenuButton: React.FC = () => {
  const { hiddenUI } = useWidgetConfig();
  const { useExternalWalletProvidersOnly } = useExternalWalletProvider();
  return !useExternalWalletProvidersOnly &&
    !hiddenUI?.includes(HiddenUI.WalletMenu) ? (
    <WalletMenuButton />
  ) : null;
};

export const WalletMenuButton: React.FC = () => {
  const { variant, hiddenUI } = useWidgetConfig();
  const { account, accounts } = useAccount();

  const [fromChainId] = useFieldValues('fromChain');
  const { chain: fromChain } = useChain(fromChainId);

  const activeAccount =
    (fromChain
      ? accounts.find(
          (account) => account.chainType === fromChain?.network_type
        )
      : undefined) || account;

  if (variant === 'drawer') {
    return (
      <DrawerWalletContainer>
        {activeAccount.isConnected ? (
          <ConnectedButton account={activeAccount} />
        ) : (
          <ConnectButton />
        )}
        {!hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (
          <CloseDrawerButton header="wallet" />
        ) : null}
      </DrawerWalletContainer>
    );
  }
  return activeAccount.isConnected ? (
    <ConnectedButton account={activeAccount} />
  ) : (
    <ConnectButton />
  );
};

const ConnectButton = () => {
  const { t } = useTranslation();
  const { walletConfig, subvariant, variant } = useWidgetConfig();
  const { openWalletMenu } = useWalletMenu();
  const connect = async () => {
    if (walletConfig?.onConnect) {
      walletConfig.onConnect();
      return;
    }
    openWalletMenu();
  };

  return (
    <WalletButton
      subvariant={subvariant}
      startIcon={
        variant === 'drawer' || subvariant === 'split' ? (
          <Wallet sx={{ marginLeft: -0.25 }} />
        ) : undefined
      }
      onClick={connect}
    >
      {t('button.connectWallet')}
    </WalletButton>
  );
};

const ConnectedButton = ({ account }: { account: Account }) => {
  const { subvariant } = useWidgetConfig();
  const { chain } = useChain(account.chainId);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const walletAddress = shortenAddress(account.address);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <WalletButton
        subvariant={subvariant}
        endIcon={<ExpandMore />}
        startIcon={
          chain?.logoUrl ? (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <SmallAvatar
                  src={chain?.logoUrl}
                  alt={chain?.name}
                  sx={{ width: 12, height: 12 }}
                >
                  {chain?.name[0]}
                </SmallAvatar>
              }
            >
              <WalletAvatar
                src={getConnectorIcon(account.connector)}
                alt={account.connector?.name}
              >
                {account.connector?.name[0]}
              </WalletAvatar>
            </Badge>
          ) : (
            <Avatar
              src={getConnectorIcon(account.connector)}
              alt={account.connector?.name}
              sx={{ width: 24, height: 24 }}
            >
              {account.connector?.name[0]}
            </Avatar>
          )
        }
        onClick={handleClick}
      >
        {walletAddress}
      </WalletButton>
      <WalletMenuContainer
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <WalletMenu onClose={handleClose} />
      </WalletMenuContainer>
    </>
  );
};
