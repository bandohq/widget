import { useEffect, useState } from "react";
import { useAccount } from "@lifi/wallet-management";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useChain } from "./useChain";
import { useToken } from "./useToken";
import { useFetch } from "./useFetch";
import { useNavigate } from "react-router-dom";

export const useTransactionFlow = (product: any) => {
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const [chainId, tokenAddress, quantity, reference] = useFieldValues(
    FormKeyHelper.getChainKey("from"),
    tokenKey,
    "quantity",
    "reference"
  );
  const { chain } = useChain(chainId);
  const { token } = useToken(chain, tokenAddress);

  const { account } = useAccount({
    chainType: chain?.network_type,
  });

  const { mutate, isPending } = useFetch({
    url: "references",
    method: "POST",
    mutationOptions: {
      onSuccess: (data) => {
        const txId = data.transaction_intents?.transaction_id;
        if (txId) {
            setTransactionId(txId);            
            //TODO: Sign transaction
        }
      },
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
    },
  });

  //TODO: once transaction is signed, navigate to status page
  // navigate(`/status/${transactionId}`);

  const handleTransaction = () => {
    mutate({
      reference,
      reference_type: product?.referenceType?.name,
      transaction_intent: {
        sku: product?.sku,
        chain: chain?.key,
        token: token?.symbol,
        quantity,
        amount: parseFloat(product?.price?.fiatValue) * quantity,
        wallet: account?.address,
      },
    });
  };

  return {
    handleTransaction,
    isPending,
  };
};
