import { Badge } from '@mui/material';
import { SmallAvatar } from '../../components/Avatar/SmallAvatar';
import { WalletAvatar } from '../../components/Header/Header.style';
import { useAccount } from '@lifi/wallet-management';
import { useChain } from '../../hooks/useChain';
import { useToken } from '../../hooks/useToken';
import { useFieldValues } from '../../stores/form/useFieldValues';

export const ChainAvatar = () => {
  const { account } = useAccount();
  const { chain } = useChain(account.chainId);
  const [tokenAddress] = useFieldValues('fromToken');
  const { token } = useToken(chain, tokenAddress);
  return (
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
      <WalletAvatar src={token?.image_url} alt={token?.symbol}>
        {account.connector?.name[0]}
      </WalletAvatar>
    </Badge>
  );
};
