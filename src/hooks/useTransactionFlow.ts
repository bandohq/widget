import { useNavigate } from "react-router-dom";
import { useAccount } from "@lifi/wallet-management";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useChain } from "./useChain";
import { useQuotes } from "../providers/QuotesProvider/QuotesProvider";
import { useProduct } from "../stores/ProductProvider/ProductProvider";
import { useTransactionHelpers } from "./useTransactionHelpers";
import { useFetch } from "./useFetch";
import { useToken } from "./useToken";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";

export const useTransactionFlow = () => {
  const navigate = useNavigate();
  const { product } = useProduct();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const { quote } = useQuotes();
  const [chainId, tokenAddress, quantity, reference] = useFieldValues(
    FormKeyHelper.getChainKey("from"),
    tokenKey,
    "quantity",
    "reference",
  );
  const { chain } = useChain(chainId);
  const { token } = useToken(chain, tokenAddress);
  const { account } = useAccount({ chainType: chain?.network_type });
  const { handleServiceRequest } = useTransactionHelpers();
  const { showNotification } = useNotificationContext();
  const { mutate, isPending } = useFetch({
    url: "references/",
    method: "POST",
    mutationOptions: {
      onSuccess: async ({ data }) => {
        const txId = data.validation_id;
        if (txId) {
          try {
            const signature = await handleServiceRequest({
              txId,
              chain,
              account,
              quote,
              product,
              quantity,
              token,
            });

            console.log("Transaction Signature:", signature);

            // navigate(`/status/${txId}`, { state: { signature } });
          } catch (error) {
            showNotification("error", "Error handling the transaction signature");
            console.error("Error handling the transaction signature:", error);
          }
        }
      },
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
    },
  });

  const handleTransaction = async () => {
    mutate({
      reference: reference[0]?.value,
      reference_required_fields: reference,
      transaction_intent: {
        sku: product?.sku,
        chain: chain?.key,
        token: quote?.digital_asset, // Token address
        quantity,
        amount: quote?.digital_asset_amount * quantity,
        wallet: account?.address,
      },
    });
  };

  return {
    handleTransaction,
    isPending,
  };
};

