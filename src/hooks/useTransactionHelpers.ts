import { defineChain, parseUnits } from "viem";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import nativeTokenCatalog from "../utils/nativeTokenCatalog";
import { writeContract } from '@wagmi/core'
import {  ERC20ApproveABI } from "../utils/abis";
import { validateReference } from "../utils/validateReference";
import { useConfig } from "wagmi";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";
import { checkAllowance } from "../utils/checkAllowance";
import { useSteps } from "../providers/StepsProvider/StepsProvider";
import { useCallback } from "react";

export const useTransactionHelpers = () => {
  const config = useConfig();
  const { addStep, updateStep, clearStep } = useSteps();
  const { showNotification } = useNotificationContext();

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
        variables: { amount: totalAmount, tokenSymbol: token?.symbol },
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
    approveERC20,
    handleServiceRequest,
  };
};
