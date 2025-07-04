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
import { useCallback, useState } from "react";
import { useWidgetConfig } from "../providers/WidgetProvider/WidgetProvider";
import { useUserWallet } from "../providers/UserWalletProvider/UserWalletProvider";
import { useFlags } from "launchdarkly-react-client-sdk";

export const useTransactionFlow = () => {
  const navigate = useNavigate();
  const { product } = useProduct();
  const { integrator } = useWidgetConfig();
  const { userAcceptedTermsAndConditions } = useUserWallet();
  const { quote } = useQuotes();
  const { clearStep } = useSteps();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const [chainId, tokenAddress, reference, requiredFields] = useFieldValues(
    FormKeyHelper.getChainKey("from"),
    tokenKey,
    "reference",
    "requiredFields"
  );
  const [loading, setLoading] = useState(false);
  const { chain } = useChain(chainId);
  const { token } = useToken(chain, tokenAddress);
  const { account } = useAccount({ chainType: chain?.networkType });
  const { handleServiceRequest, signTransfer } = useTransactionHelpers();
  const { showNotification } = useNotificationContext();
  const { transactionFlow } = useFlags();

  // Nuevo flujo
  const { mutate: mutateNew, isPending: isPendingNew } = useFetch({
    url: `wallets/${account?.address}/transactions/`,
    method: "POST",
    queryParams: { integrator },
    headers: {
      "Idempotency-Key": quote?.id.toString(),
    },
    mutationOptions: {
      onSuccess: async ({ transactionId }) => {
        setLoading(false);
        if (transactionId) {
          navigate(`/status/${transactionId}`);
        } else {
          console.error("No transaction ID returned");
        }
      },
      onError: (error) => {
        console.error("New flow error:", error);
      },
    },
  });

  // Flujo viejo
  const { mutate: mutateOld, isPending: isPendingOld } = useFetch({
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
            console.error("handleServiceRequest failed:", error);
          }
        }
      },
      onError: (error) => {
        console.error("Old flow error:", error);
      },
    },
  });

  const handleTransaction = useCallback(async () => {
    setLoading(true);
    const payload = {
      reference,
      requiredFields,
      transactionIntent: {
        sku: product?.sku,
        chain: chain?.key,
        token: quote?.digitalAsset,
        quote_id: quote?.id,
        quantity: 1,
        amount: parseFloat(quote?.digitalAssetAmount),
        wallet: account?.address,
        integrator,
        has_accepted_terms: userAcceptedTermsAndConditions,
      },
    };

    if (transactionFlow) {
      try {
        // TODO: reference
        const signature = await signTransfer(
          quote.transactionRequest,
          "123",
          token?.symbol
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        mutateNew({
          ...payload,
          transactionReceipt: {
            hash: signature,
            virtualMachineType: account?.chainType,
          },
        });
      } catch (error) {
        console.error("Error signing transaction:", error);
      }
    } else {
      mutateOld(payload);
    }
  }, [
    transactionFlow,
    mutateNew,
    mutateOld,
    signTransfer,
    quote,
    product?.sku,
    chain?.key,
    reference,
    requiredFields,
    quote?.digitalAsset,
    quote?.digitalAssetAmount,
    account?.address,
    userAcceptedTermsAndConditions,
    integrator,
    account?.chainType,
  ]);

  return {
    handleTransaction,
    isPending: transactionFlow ? loading : isPendingOld,
  };
};
