import { defineChain, erc20Abi, parseEther, parseUnits } from "viem";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import nativeTokenCatalog from "../utils/nativeTokenCatalog";
import { writeContract } from "@wagmi/core";
import { ERC20ApproveABI } from "../utils/abis";
import { validateReference } from "../utils/validateReference";
import { useConfig } from "wagmi";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";
import { checkAllowance } from "../utils/checkAllowance";
import { useSteps } from "../providers/StepsProvider/StepsProvider";
import { useCallback, useState } from "react";
import { formatTotalAmount } from "../utils/format";
import { sendTransaction } from "@wagmi/core";
import { TransactionRequest } from "../providers/QuotesProvider/QuotesProvider";
import { Address } from "../pages/SelectChainPage/types";
import { Token } from "../types/widget";
import { useAccount } from "@lifi/wallet-management";
import { useToken } from "../hooks/useToken";
import { useChain } from "../hooks/useChain";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useTranslation } from "react-i18next";

export const useTransactionHelpers = () => {
  const [loading, setLoading] = useState(false);
  const config = useConfig();
  const { account } = useAccount();
  const { t } = useTranslation();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const [tokenAddress] = useFieldValues(tokenKey);
  const { chain } = useChain(account?.chainId);
  const { token } = useToken(chain, tokenAddress);
  const { addStep, updateStep, clearStep } = useSteps();
  const { showNotification } = useNotificationContext();

  const formatFiatAmount = (amount: string | undefined): string => {
    return amount ? (parseFloat(amount) * 100).toFixed(0) : "0";
  };

  const transferNativeToken = async (
    transactionRequest: TransactionRequest
  ) => {
    try {
      const txHash = await sendTransaction(config, {
        to: transactionRequest.to,
        value: parseEther(transactionRequest.value),
        data: transactionRequest.data,
        chain: transactionRequest.chainId,
      });

      return txHash;
    } catch (error) {
      showNotification("error", t("error.title.transactionFailed"));
      console.error("Error at transferNativeToken:", error);
      throw error;
    }
  };

  const transferErc20Token = async (transactionRequest: TransactionRequest) => {
    try {
      const txHash = await writeContract(config, {
        address: token.address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [
          transactionRequest.to as Address,
          parseUnits(transactionRequest.value, token.decimals),
        ],
        chain: undefined,
        account: account?.address as Address,
      });

      return txHash;
    } catch (error) {
      showNotification("error", t("error.title.transactionFailed"));
      console.error("Error at transferErc20Token:", error);
      throw error;
    }
  };

  const signTransfer = async (transactionRequest: TransactionRequest) => {
    setLoading(true);
    try {
      const nativeToken = chain?.nativeToken;

      if (nativeToken.address === token.address) {
        return await transferNativeToken(transactionRequest);
      } else {
        return await transferErc20Token(transactionRequest);
      }
    } finally {
      setLoading(false);
    }
  };

  const approveERC20 = async (
    spenderAddress,
    amount,
    tokenAddress,
    account,
    chain,
    config
  ) => {
    try {
      const result = await writeContract(config, {
        address: tokenAddress,
        abi: ERC20ApproveABI,
        functionName: "approve",
        args: [spenderAddress, amount],
        chain,
        account: account?.address,
      });

      return result as `0x${string}`;
    } catch (error) {
      showNotification("error", "Error al aprobar tokens, intente más tarde");
      console.error("Error al aprobar tokens:", error);
      throw error;
    }
  };

  const handleNativeTokenRequest = async ({
    chain,
    account,
    quote,
    txId,
    serviceID,
    formattedChain,
  }) => {
    const requestServiceABI = BandoRouter.abi.find(
      (item) => item.name === "requestService"
    );

    const weiAmount = parseUnits(
      quote?.digitalAssetAmount.toString(),
      chain?.nativeToken?.decimals
    );
    const value = parseUnits(
      quote?.totalAmount.toString(),
      chain?.nativeToken?.decimals
    );

    const payload = {
      payer: account?.address,
      fiatAmount: formatFiatAmount(quote?.totalAmount),
      serviceRef: txId,
      weiAmount,
    };

    addStep({ message: "form.status.signTransaction", type: "info" });

    await writeContract(config, {
      value,
      address: chain?.protocolContracts?.BandoRouterProxy,
      abi: [requestServiceABI],
      functionName: "requestService",
      args: [serviceID, payload],
      chain: formattedChain,
      account: account?.address,
    });

    updateStep({
      message: "form.status.signTransactionCompleted",
      type: "completed",
    });
  };

  const handleERC20TokenRequest = async ({
    chain,
    account,
    quote,
    txId,
    serviceID,
    token,
  }) => {
    try {
      const totalAmount = parseFloat(quote?.totalAmount);
      const amountInUnits = parseUnits(totalAmount.toString(), token?.decimals);
      addStep({
        message: "form.status.approveTokens",
        type: "info",
        variables: {
          amount: formatTotalAmount(quote, token),
          tokenSymbol: token?.symbol,
        },
      });

      await approveERC20(
        chain?.protocolContracts?.BandoRouterProxy,
        amountInUnits,
        token.address,
        account,
        chain,
        config
      );

      updateStep({ message: "form.status.validateAllowance", type: "loading" });

      await checkAllowance(
        chain?.protocolContracts?.BandoRouterProxy,
        token.address,
        account,
        chain,
        config,
        parseUnits(quote?.totalAmount.toString(), token?.decimals)
      );

      updateStep({
        message: "form.status.validateAllowanceCompleted",
        type: "completed",
      });

      const requestERC20ServiceABI = BandoRouter.abi.find(
        (item) => item.name === "requestERC20Service"
      );

      const payload = {
        payer: account?.address,
        fiatAmount: formatFiatAmount(quote?.fiatAmount),
        serviceRef: txId,
        token: token.address,
        tokenAmount: parseUnits(
          quote?.digitalAssetAmount.toString(),
          token?.decimals
        ),
      };

      addStep({ message: "form.status.signTransaction", type: "info" });

      await writeContract(config, {
        address: chain?.protocolContracts?.BandoRouterProxy,
        abi: [requestERC20ServiceABI],
        functionName: "requestERC20Service",
        args: [serviceID, payload],
        chain: chain.chainId,
        account: account?.address,
      });

      updateStep({
        message: "form.status.signTransactionCompleted",
        type: "completed",
      });
    } catch (error) {
      clearStep();
      showNotification("error", "Error in handleERC20TokenRequest");
      console.error("Error in handleERC20TokenRequest:", error);
      throw error;
    }
  };

  const handleServiceRequest = useCallback(
    async ({ txId, chain, account, quote, product, token }) => {
      try {
        const serviceID = product?.evmServiceId;
        const nativeToken = nativeTokenCatalog.find(
          (item) => item.key === chain?.key
        );

        const formattedChain = defineChain(
          transformToChainConfig(chain, nativeToken)
        );

        addStep({
          message: "form.status.processingOrder",
          description: "form.status.wait",
          type: "loading",
        });

        const isReferenceValid = await validateReference(
          chain,
          serviceID,
          txId,
          config
        );

        updateStep({
          message: "form.status.processingOrderCompleted",
          type: "completed",
        });

        if (!isReferenceValid) {
          showNotification("error", "Invalid reference code");
          clearStep();
          return;
        }

        if (token.key === nativeToken?.native_token.symbol) {
          await handleNativeTokenRequest({
            chain,
            account,
            quote,
            txId,
            serviceID,
            formattedChain,
          });
        } else {
          await handleERC20TokenRequest({
            chain,
            account,
            quote,
            txId,
            serviceID,
            token,
          });
        }

        clearStep();
      } catch (error) {
        clearStep();
        showNotification("error", "Error in handleServiceRequest");
        console.error("Error in handleServiceRequest:", error);
        throw error;
      }
    },
    [addStep, updateStep, clearStep, showNotification]
  );

  return {
    loading,
    signTransfer,
    approveERC20,
    handleServiceRequest,
  };
};
