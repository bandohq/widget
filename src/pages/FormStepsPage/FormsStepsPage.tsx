import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components/PageContainer';
import { useHeader } from '../../hooks/useHeader';
import { useProduct } from '../../stores/ProductProvider/ProductProvider';
import { useQuotes } from '../../providers/QuotesProvider/QuotesProvider';
import {
  Avatar,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { ChainAvatar } from './ChainAvatar';
import { AvatarBadgedDefault } from '../../components/Avatar/Avatar';
import { Steps } from '../../components/Steps/Step';
import { useTransactionFlow } from '../../hooks/useTransactionFlow';
import { useAccount } from '@lifi/wallet-management';
import { useChain } from '../../hooks/useChain';
import { useToken } from '../../hooks/useToken';
import { FormKeyHelper } from '../../stores/form/types';
import { useFieldValues } from '../../stores/form/useFieldValues';
import { formatTotalAmount } from '../../utils/format';


export const FormsStepsPage = () => {
  const { t } = useTranslation();
  const { product } = useProduct();
  const { quote } = useQuotes();
  const { handleTransaction } = useTransactionFlow();
  useHeader(t('header.title'));
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const [tokenAddress] = useFieldValues(tokenKey);
  const { account } = useAccount();
  const { chain } = useChain(account?.chainId);
  const { token } = useToken(chain, tokenAddress);
  
  const renderProductAvatar = () =>
    product ? (
      <Avatar alt={product.name} src={product.imageUrl} />
    ) : (
      <AvatarBadgedDefault />
    );

  useEffect(() => {
    handleTransaction();
  }, []);

  return (
    <PageContainer>
      <Card>
        <List>
          <ListItem>
            <ListItemAvatar>
              <ChainAvatar />
            </ListItemAvatar>
            <ListItemText primary={formatTotalAmount(quote, token)} />
          </ListItem>
          <Steps />
          <ListItem>
            <ListItemAvatar>{renderProductAvatar()}</ListItemAvatar>
            <ListItemText
              primary={product?.brand}
              secondary={`${product.productType} in ${product.country}`}
            />
          </ListItem>
        </List>
      </Card>
    </PageContainer>
  );
};
