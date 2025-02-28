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

export const FormsStepsPage = () => {
  const { t } = useTranslation();
  const { product } = useProduct();
  const { quote } = useQuotes();
  const { handleTransaction } = useTransactionFlow();
  useHeader(t('header.title'));

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
            <ListItemText
              primary={quote?.totalAmount}
              secondary={`${quote?.fiatAmount} ${quote?.fiatCurrency}`}
            />
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
