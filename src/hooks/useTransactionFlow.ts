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
import { useTranslation } from "react-i18next";
import { navigationRoutes } from "../utils/navigationRoutes";
import { useWorld } from "./useWorld";
import { ChainType } from "../pages/SelectChainPage/types";
import { parseERC20TransferData } from "../utils/format";

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
  const { isWorld, provider } = useWorld();
  const { chain } = useChain(chainId);
  const { token } = useToken(chain, tokenAddress);
  const { account } = useAccount({ chainType: chain?.networkType });
  const { handleServiceRequest, signTransfer, worldTransfer } =
    useTransactionHelpers();
  const { showNotification } = useNotificationContext();
  const { transactionFlow } = useFlags();
  const { t } = useTranslation();

  const userAddress = isWorld
    ? provider?.user?.walletAddress
    : account?.address;

  // Nuevo flujo
  const { mutate: mutateNew, isPending: isPendingNew } = useFetch({
    url: `wallets/${userAddress}/transactions/`,
    method: "POST",
    queryParams: { integrator },
    headers: {
      "Idempotency-Key": quote?.id.toString(),
    },
    mutationOptions: {
      onSuccess: async ({ transactionId }) => {
        console.log("success tx on backend", transactionId);
        setLoading(false);
        if (transactionId) {
          navigate(`/status/${transactionId}`);
        } else {
          console.error("No transaction ID returned");
        }
      },
      onError: (error) => {
        console.log("New flow error:", JSON.stringify(error));
        console.error("New flow error:", error);
        setLoading(false);
        navigate(`${navigationRoutes.error}?error=true`);
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
        showNotification("error", t("error.message.errorProcessingPurchase"));
        setLoading(false);
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
        wallet: userAddress,
        integrator,
        has_accepted_terms: userAcceptedTermsAndConditions,
      },
    };

    if (transactionFlow) {
      try {
        let signature: string | undefined;
        if (isWorld) {
          const destinationAddress = parseERC20TransferData(
            quote?.transactionRequest?.data
          );

          if (!destinationAddress) {
            throw new Error(
              "Error parsing destination address from ERC20 data"
            );
          }

          signature = await worldTransfer({
            reference: quote?.id.toString(),
            to: destinationAddress,
            amount: quote?.totalAmount,
            token: token?.symbol,
            description: `Purchase of ${quote?.digitalAssetAmount} ${token?.symbol}: ${quote?.id}`,
          });

          console.log(
            "worldTransfer hash",
            JSON.stringify({
              reference: quote?.id.toString(),
              to: destinationAddress,
              amount: quote?.totalAmount,
              token: token?.symbol,
              hash: signature,
            })
          );
        } else {
          signature = await signTransfer(quote.transactionRequest);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(
          "call to backend with payload",
          JSON.stringify({ payload, signature })
        );
        mutateNew({
          ...payload,
          transactionReceipt: {
            hash: signature,
            virtualMachineType: isWorld ? ChainType.EVM : account?.chainType,
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
