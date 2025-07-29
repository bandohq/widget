import { useConfig } from "wagmi";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";
import { useCallback, useState } from "react";
import { sendTransaction, writeContract } from "@wagmi/core";
import { TransactionRequest } from "../providers/QuotesProvider/QuotesProvider";
import { useAccount } from "@lifi/wallet-management";
import { useChain } from "../hooks/useChain";
import { useTranslation } from "react-i18next";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import { useSteps } from "../providers/StepsProvider/StepsProvider";
import { ERC20ApproveABI } from "../utils/abis";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import { defineChain, parseUnits } from "viem";
import { formatTotalAmount } from "../utils/format";
import { checkAllowance } from "../utils/checkAllowance";
import { validateReference } from "../utils/validateReference";
import { useWorld } from "./useWorld";
import { getTxHashByReference } from "../utils/getTxHashByReference";
import Web3 from "web3";

export const useTransactionHelpers = () => {
  const [loading, setLoading] = useState(false);
  const config = useConfig();
  const { account } = useAccount();
  const { t } = useTranslation();
  const { isWorld, provider } = useWorld();
  const { chain } = useChain(isWorld ? 480 : account?.chainId);
  const { showNotification } = useNotificationContext();
  const { addStep, updateStep, clearStep } = useSteps();

  // New flow

  const worldTransfer = async ({
    reference,
    to,
    amount,
    token,
    description = "Bando Payment through World App",
  }) => {
    const rpc = chain?.rpcUrl;
    const web3 = new Web3(rpc);
    const startBlock = Number(await web3.eth.getBlockNumber());
    const totalAmount = parseFloat(amount);
    const amountInUnits = parseUnits(totalAmount.toString(), token?.decimals);
    const payload = {
      reference,
      to,
      tokens: [
        {
          symbol: token,
          token_amount: amountInUnits.toString(),
        },
      ],
      description,
    };

    console.log("world payload", JSON.stringify(payload));

    try {
      const { finalPayload } = await provider?.commandsAsync.pay(payload);

      if (finalPayload.status === "success") {
        await new Promise((r) => setTimeout(r, 1500));

        const txHash = await getTxHashByReference(
          reference,
          to,
          chain?.rpcUrl,
          startBlock
        );
        console.log("tx hash outside", txHash);
        return txHash;
      } else {
        console.log("finalPayload error", JSON.stringify(finalPayload));
        console.error("Error at worldTransfer:", JSON.stringify(finalPayload));
        showNotification("error", t("error.title.transactionFailed"));
        throw new Error(`Payment failed: ${finalPayload.error_code}`);
      }
    } catch (error) {
      console.error("Error at worldTransfer:", error);
      throw error;
    }
  };

  const sendToken = async (transactionRequest: TransactionRequest) => {
    try {
      if (!chain) throw new Error("Chain not found");

      const configChain = transformToChainConfig(chain, chain.nativeToken);

      const txHash = await sendTransaction(config, {
        to: transactionRequest.to,
        value: BigInt(transactionRequest.value || 0),
        data: transactionRequest.data,
        chain: configChain,
        gas: BigInt(transactionRequest.gas),
        gasLimit: BigInt(transactionRequest.gasLimit),
        maxFeePerGas: transactionRequest.maxFeePerGas
          ? BigInt(transactionRequest.maxFeePerGas)
          : undefined,
        maxPriorityFeePerGas: transactionRequest.maxPriorityFeePerGas
          ? BigInt(transactionRequest.maxPriorityFeePerGas)
          : undefined,
        type: transactionRequest.type,
      });

      return txHash;
    } catch (error) {
      showNotification("error", t("error.title.transactionFailed"));
      console.error("Error at sendToken:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signTransfer = async (transactionRequest: TransactionRequest) => {
    setLoading(true);
    try {
      return await sendToken(transactionRequest);
    } catch (error) {
      console.error("Error at signTransfer:", error);
      throw error;
    }
  };

  // Old flow
  const formatFiatAmount = (amount: string | undefined): string => {
    return amount ? (parseFloat(amount) * 100).toFixed(0) : "0";
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
        const nativeToken = chain?.nativeToken;

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

        if (token.key?.toLowerCase() === nativeToken?.symbol?.toLowerCase()) {
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
    worldTransfer,
    handleServiceRequest,
  };
};
