import { useNavigate } from "react-router-dom";
import { useAccount } from "@lifi/wallet-management";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useChain } from "./useChain";
import { useQuotes } from "../providers/QuotesProvider/QuotesProvider";
import { useProduct } from "../stores/ProductProvider/ProductProvider";
import { useTransactionHelpers } from "./useTransactionHelpers";
import { useFetch } from "./useFetch";
import { createDynamicConfig } from "../utils/configWagmi";

export const useTransactionFlow = () => {
  const navigate = useNavigate();
  const { product } = useProduct();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const { quote } = useQuotes();
  const [chainId, quantity, reference] = useFieldValues(
    FormKeyHelper.getChainKey("from"),
    "quantity",
    "reference"
  );
  const { chain } = useChain(chainId);
  const { account } = useAccount({ chainType: chain?.network_type });
  const { handleServiceRequest } = useTransactionHelpers();
  const config = createDynamicConfig(chain);

  const { mutate, isPending } = useFetch({
    url: "references/",
    method: "POST",
    mutationOptions: {
      onSuccess: async ({ data }) => {
        const txId = data.transaction_intent?.validated_reference_id;
        if (txId) {
          try {
            const signature = await handleServiceRequest({
              txId,
              chain,
              account,
              tokenKey,
              quote,
              product,
              quantity,
              config
            });

            console.log("Transaction Signature:", signature);

            // navigate(`/status/${txId}`, { state: { signature } });
            console.log("Transaction ID:", txId);
          } catch (error) {
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

