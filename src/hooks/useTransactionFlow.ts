import { useNavigate } from "react-router-dom";
import { useAccount } from "@lifi/wallet-management";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useChain } from "./useChain";
import { useQuotes } from "../providers/QuotesProvider/QuotesProvider";
import { useProduct } from "../stores/ProductProvider/ProductProvider";
import { useTransactionHelpers } from "./useTransactionHelpers";
import { useFetch } from "./useFetch";
import { useCallback } from "react";
import { useWidgetConfig } from "../providers/WidgetProvider/WidgetProvider";
import { useUserWallet } from "../providers/UserWalletProvider/UserWalletProvider";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";

export const useTransactionFlow = () => {
  const navigate = useNavigate();
  const { product } = useProduct();
  const { integrator } = useWidgetConfig();
  const { userAcceptedTermsAndConditions } = useUserWallet();
  const { quote } = useQuotes();
  const [chainId, reference, requiredFields] = useFieldValues(
    FormKeyHelper.getChainKey("from"),
    "reference",
    "requiredFields"
  );
  const { chain } = useChain(chainId);
  const { account } = useAccount({ chainType: chain?.networkType });
  const { signTransfer } = useTransactionHelpers();
  const { mutate, isPending } = useFetch({
    url: `wallets/${account?.address}/transactions/`,
    method: "POST",
    queryParams: {
      integrator,
    },
    headers: {
      "Idempotency-Key": quote?.id.toString(),
    },
    mutationOptions: {
      onSuccess: async ({ data }) => {
        console.log("onSuccess triggered with data:", data);
        const txId = data.validationId;
        if (txId) {
          navigate(`/status/${data?.transactionIntent?.id}`);
        } else {
          console.log("No txId found in response data");
        }
      },
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
    },
  });

  const handleTransaction = useCallback(async () => {
    const signature = await signTransfer(quote.transactionRequest);
    mutate({
      reference: reference,
      requiredFields,
      transactionReceipt: {
        hash: signature,
        virtualMachineType: account?.chainType,
      },
      transactionIntent: {
        sku: product?.sku,
        chain: chain?.key,
        token: quote?.digitalAsset, // Token address
        quote_id: quote?.id,
        quantity: 1,
        amount: parseFloat(quote?.digitalAssetAmount),
        wallet: account?.address,
        integrator,
        has_accepted_terms: userAcceptedTermsAndConditions,
      },
    });
  }, [
    mutate,
    reference,
    requiredFields,
    product?.sku,
    chain?.key,
    quote?.digitalAsset,
    quote?.digitalAssetAmount,
    account?.address,
    userAcceptedTermsAndConditions,
    integrator,
  ]);

  return {
    handleTransaction,
    isPending,
  };
};
