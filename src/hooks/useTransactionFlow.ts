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
import { useSteps } from "../providers/StepsProvider/StepsProvider";
import { useCallback } from "react";
import { useWidgetConfig } from "../providers/WidgetProvider/WidgetProvider";
import { useUserWallet } from "../providers/UserWalletProvider/UserWalletProvider";

export const useTransactionFlow = () => {
  const navigate = useNavigate();
  const { product } = useProduct();
  const { integrator } = useWidgetConfig();
  const { userAcceptedTermsAndConditions } = useUserWallet();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const { quote } = useQuotes();
  const { clearStep } = useSteps();
  const [chainId, tokenAddress, reference, requiredFields] = useFieldValues(
    FormKeyHelper.getChainKey("from"),
    tokenKey,
    "reference",
    "requiredFields"
  );
  const { chain } = useChain(chainId);
  const { token } = useToken(chain, tokenAddress);
  const { account } = useAccount({ chainType: chain?.networkType });
  const { handleServiceRequest } = useTransactionHelpers();
  const { showNotification } = useNotificationContext();
  const { mutate, isPending } = useFetch({
    url: "references/",
    method: "POST",
    mutationOptions: {
      onSuccess: async ({ data }) => {
        const txId = data.validationId;
        if (txId) {
          try {
            const signature = await handleServiceRequest({
              txId,
              chain,
              account,
              quote,
              product,
              token,
            });
            clearStep();
            navigate(`/status/${data?.transactionIntent?.id}`, {
              state: { signature },
            });
          } catch (error) {
            clearStep();
            showNotification(
              "error",
              "Error handling the transaction signature"
            );
            console.error("Error handling the transaction signature:", error);
          }
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
