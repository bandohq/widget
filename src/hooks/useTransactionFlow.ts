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
import { useWorld } from "./useWorld";
import { parseERC20TransferData } from "../utils/format";
import { useToken } from "./useToken";
import { ChainType } from "../pages/SelectChainPage/types";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";
import { waitForReceipt } from "../utils/txUtils";
import { RetryPresets } from "../utils/retryUtils";

export const useTransactionFlow = () => {
  const navigate = useNavigate();
  const { product } = useProduct();
  const { isWorld, provider } = useWorld();
  const { integrator } = useWidgetConfig();
  const { userAcceptedTermsAndConditions } = useUserWallet();
  const { quote } = useQuotes();
  const [chainId, tokenAddress, reference, requiredFields] = useFieldValues(
    FormKeyHelper.getChainKey("from"),
    FormKeyHelper.getTokenKey("from"),
    "reference",
    "requiredFields"
  );
  const [loading, setLoading] = useState(false);
  const { chain } = useChain(chainId);
  const { token } = useToken(chain, tokenAddress);
  const { account } = useAccount({ chainType: chain?.networkType });
  const { showNotification } = useNotificationContext();
  const { signTransfer, worldTransfer } = useTransactionHelpers();

  const userAddress = isWorld
    ? provider?.user?.walletAddress
    : account?.address;

  const { mutate: mutateNew, isPending } = useFetch({
    url: `wallets/${userAddress}/transactions/`,
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

  const processTransactionWithReceipt = useCallback(
    async (signature: string) => {
      try {
        const receipt = await waitForReceipt({
          rpc: chain?.rpcUrl,
          txHash: signature,
          confirmations: 1,
          retryConfig: RetryPresets.receipt,
        });

        if (!receipt) {
          throw new Error("Transaction receipt not found");
        }

        const payload = {
          reference,
          requiredFields,
          transactionIntent: {
            sku: product?.sku,
            chain: chain?.key,
            token: quote?.digitalAsset,
            quoteId: quote?.id,
            quantity: 1,
            amount: parseFloat(quote?.digitalAssetAmount),
            wallet: userAddress,
            integrator,
            hasAcceptedTerms: userAcceptedTermsAndConditions,
          },
          transactionReceipt: {
            hash: signature,
            virtualMachineType: isWorld ? ChainType.EVM : account?.chainType,
          },
        };

        mutateNew(payload);
      } catch (error) {
        console.error("Error processing transaction:", error);
        showNotification("error", "Error processing transaction");
        navigate(`${navigationRoutes.error}?error=true`);
      }
    },
    [
      chain?.rpcUrl,
      reference,
      requiredFields,
      product?.sku,
      chain?.key,
      quote?.digitalAsset,
      quote?.id,
      quote?.digitalAssetAmount,
      userAddress,
      integrator,
      userAcceptedTermsAndConditions,
      isWorld,
      account?.chainType,
    ]
  );

  const handleTransaction = useCallback(async () => {
    setLoading(true);

    try {
      let txHash: string | undefined;

      if (isWorld) {
        const { destinationAddress, amount } = parseERC20TransferData(
          quote?.transactionRequest?.data
        );

        if (!destinationAddress || !amount) {
          throw new Error("Error parsing destination address from ERC20 data");
        }

        txHash = await worldTransfer({
          reference: quote?.id.toString(),
          to: destinationAddress,
          amount: amount,
          token: token,
          description: `Purchase of ${quote?.digitalAssetAmount} ${token?.symbol}: ${quote?.id}`,
        });
      } else {
        txHash = await signTransfer(quote.transactionRequest);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(`/status/pending`, {
        state: {
          signature: txHash,
          processTransactionWithReceipt,
          isPending,
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
    processTransactionWithReceipt,
    isPending: loading,
  };
};
