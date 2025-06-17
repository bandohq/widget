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
  const { showNotification } = useNotificationContext();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const { quote } = useQuotes();
  const [chainId, reference, requiredFields] = useFieldValues(
    FormKeyHelper.getChainKey("from"),
    tokenKey,
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
          try {
            console.log(
              "Attempting to sign transfer with request:",
              quote.transactionRequest
            );
            const signature = await signTransfer(quote.transactionRequest);
            console.log("Signature received:", signature);
            if (!signature) {
              throw new Error("No se pudo obtener la firma de la transacción");
            }
            console.log(
              "Navigating to status page with ID:",
              data?.transactionIntent?.id
            );
            navigate(`/status/${data?.transactionIntent?.id}`, {
              state: { signature },
            });
          } catch (error) {
            console.error("Error handling the transaction signature:", error);
            showNotification("error", "Error al firmar la transacción");
          }
        } else {
          console.log("No txId found in response data");
        }
      },
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
    },
  });

  const handleTransaction = useCallback(() => {
    mutate({
      reference: reference,
      requiredFields,
      transactionIntent: {
        sku: product?.sku,
        chain: chain?.key,
        token: quote?.digitalAsset, // Token address
        quote_id: quote?.id,
        quantity: 1,
        amount: quote?.digitalAssetAmount,
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
