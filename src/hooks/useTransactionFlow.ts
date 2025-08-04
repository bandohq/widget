import { useNavigate } from "react-router-dom";
import { useAccount } from "@lifi/wallet-management";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useChain } from "./useChain";
import { useQuotes } from "../providers/QuotesProvider/QuotesProvider";
import { useProduct } from "../stores/ProductProvider/ProductProvider";
import { useTransactionHelpers } from "./useTransactionHelpers";
import { useFetch } from "./useFetch";
import { useCallback, useState } from "react";
import { useWidgetConfig } from "../providers/WidgetProvider/WidgetProvider";
import { useUserWallet } from "../providers/UserWalletProvider/UserWalletProvider";
import { navigationRoutes } from "../utils/navigationRoutes";

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
  const [loading, setLoading] = useState(false);
  const { chain } = useChain(chainId);
  const { account } = useAccount({ chainType: chain?.networkType });
  const { signTransfer } = useTransactionHelpers();

  const { mutate: mutateNew } = useFetch({
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
        setLoading(false);
        navigate(`${navigationRoutes.error}?error=true`);
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

    try {
      const signature = await signTransfer(quote.transactionRequest);
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
  }, [
    mutateNew,
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
    isPending: loading,
  };
};
