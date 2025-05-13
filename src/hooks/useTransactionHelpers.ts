import { defineChain, parseUnits } from "viem";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import nativeTokenCatalog from "../utils/nativeTokenCatalog";
import { writeContract, readContract } from "@wagmi/core";
import { ERC20ApproveABI } from "../utils/abis";
import { validateReference } from "../utils/validateReference";
import { useConfig } from "wagmi";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";
import { checkAllowance } from "../utils/checkAllowance";
import { useSteps } from "../providers/StepsProvider/StepsProvider";
import { useCallback } from "react";
import {
  detectMultisig,
  sdk,
  sendViaSafe,
  sendBatchViaSafe,
} from "../utils/safeFunctions";

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
    const isMultisig = await detectMultisig();

    try {
      if (isMultisig) {
        const safeResponse = await sendViaSafe({
          to: tokenAddress,
          abi: ERC20ApproveABI,
          functionName: "approve",
          args: [spenderAddress, amount],
        });

        console.log("Safe transaction submitted:", safeResponse);

        return { success: true, isMultisig: true, safeResponse };
      }

      await writeContract(config, {
        address: tokenAddress,
        abi: ERC20ApproveABI,
        functionName: "approve",
        args: [spenderAddress, amount],
        chain,
        account: account?.address,
      });

      return { success: true, isMultisig: false };
    } catch (error) {
      showNotification("error", "Error on approving tokens, try later");
      console.error("Error on approving tokens:", error);
      return { success: false };
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
    const isMultisig = await detectMultisig();

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
      payer: isMultisig
        ? (await sdk.safe.getInfo()).safeAddress
        : account?.address,
      fiatAmount: formatFiatAmount(quote?.totalAmount),
      serviceRef: txId,
      weiAmount,
    };

    addStep({ message: "form.status.signTransaction", type: "info" });

    if (isMultisig) {
      const safeResponse = await sendViaSafe({
        to: chain?.protocolContracts?.BandoRouterProxy,
        abi: [requestServiceABI],
        functionName: "requestService",
        args: [serviceID, payload],
        value: value.toString(),
      });

      console.log("Safe transaction submitted:", safeResponse);

      updateStep({
        message: "form.status.signTransaction",
        type: "info",
        description: "form.status.wait",
      });

      return { success: true, isMultisig: true, safeResponse };
    } else {
      await writeContract(config, {
        value,
        address: chain?.protocolContracts?.BandoRouterProxy,
        abi: [requestServiceABI],
        functionName: "requestService",
        chain: formattedChain,
        account: account?.address,
      });

      updateStep({
        message: "form.status.signTransactionCompleted",
        type: "completed",
      });

      return { success: true, isMultisig: false };
    }
  };

  const checkCurrentAllowance = async (
    spenderAddress,
    tokenAddress,
    account,
    chain,
    config
  ) => {
    try {
      const safeAddress = (await sdk.safe.getInfo()).safeAddress;
      const ownerAddress = safeAddress || account?.address;

      const allowance = await readContract(config, {
        address: tokenAddress,
        abi: ERC20ApproveABI,
        functionName: "allowance",
        args: [ownerAddress, spenderAddress],
        chainId: chain.chainId,
      });

      return allowance;
    } catch (error) {
      console.error("Error checking allowance:", error);
      return BigInt(0);
    }
  };

  const handleERC20TokenRequest = async ({
    chain,
    account,
    quote,
    txId,
    serviceID,
    token,
  }) => {
    const isMultisig = await detectMultisig();
    const totalAmount = parseFloat(quote?.totalAmount);
    const increaseAmount = totalAmount * 1.01; //Add 1% to the total amount for allowance issue
    const amountInUnits = parseUnits(
      increaseAmount.toString(),
      token?.decimals
    );
    addStep({
      message: "form.status.approveTokens",
      type: "info",
      variables: { amount: increaseAmount, tokenSymbol: token?.symbol },
    });

    if (isMultisig) {
      return await handleERC20BatchMultisig({
        chain,
        account,
        quote,
        txId,
        serviceID,
        token,
        amountInUnits,
      });
    }

    const approveResult = await approveERC20(
      chain?.protocolContracts?.BandoRouterProxy,
      amountInUnits,
      token.address,
      account,
      chain,
      config
    );

    if (!approveResult.success) {
      throw new Error("Failed to approve tokens");
    }

    if (approveResult.isMultisig) {
      updateStep({
        message: "form.status.approveTokens",
        type: "info",
        description: "form.status.wait",
        variables: { amount: increaseAmount, tokenSymbol: token?.symbol },
      });
      return approveResult;
    }

    updateStep({ message: "form.status.validateAllowance", type: "loading" });

    await checkAllowance(
      chain?.protocolContracts?.BandoRouterProxy,
      token.address,
      account,
      chain,
      config,
      parseUnits(quote?.totalAmount.toString(), token?.decimals),
      isMultisig
    );

    updateStep({
      message: "form.status.validateAllowanceCompleted",
      type: "completed",
    });

    const requestERC20ServiceABI = BandoRouter.abi.find(
      (item) => item.name === "requestERC20Service"
    );

    const payload = {
      payer: isMultisig
        ? (await sdk.safe.getInfo()).safeAddress
        : account?.address,
      fiatAmount: formatFiatAmount(quote?.totalAmount),
      serviceRef: txId,
      token: token.address,
      tokenAmount: parseUnits(
        quote?.digitalAssetAmount.toString(),
        token?.decimals
      ),
    };

    addStep({ message: "form.status.signTransaction", type: "info" });

    if (isMultisig) {
      const safeResponse = await sendViaSafe({
        to: chain?.protocolContracts?.BandoRouterProxy,
        abi: [requestERC20ServiceABI],
        functionName: "requestERC20Service",
        args: [serviceID, payload],
      });

      console.log("Safe ERC20 transaction submitted:", safeResponse);

      updateStep({
        message: "form.status.signTransaction",
        type: "info",
        description: "form.status.wait",
      });

      return { success: true, isMultisig: true, safeResponse };
    } else {
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

      return { success: true, isMultisig: false };
    }
  };

  const handleERC20BatchMultisig = async ({
    chain,
    account,
    quote,
    txId,
    serviceID,
    token,
    amountInUnits,
  }) => {
    const safeAddress = (await sdk.safe.getInfo()).safeAddress;
    const requestERC20ServiceABI = BandoRouter.abi.find(
      (item) => item.name === "requestERC20Service"
    );

    const payload = {
      payer: safeAddress,
      fiatAmount: formatFiatAmount(quote?.totalAmount),
      serviceRef: txId,
      token: token.address,
      tokenAmount: parseUnits(
        quote?.digitalAssetAmount.toString(),
        token?.decimals
      ),
    };

    // Verificar si ya tiene suficiente allowance
    updateStep({ message: "form.status.checkingAllowance", type: "loading" });
    const requiredAmount = parseUnits(
      quote?.totalAmount.toString(),
      token?.decimals
    );
    const currentAllowance = await checkCurrentAllowance(
      chain?.protocolContracts?.BandoRouterProxy,
      token.address,
      account,
      chain,
      config
    );

    let transactions = [];

    // Solo agregar la transacción de approve si es necesario
    if (
      typeof currentAllowance === "bigint" &&
      currentAllowance < BigInt(requiredAmount)
    ) {
      transactions.push({
        to: token.address,
        abi: ERC20ApproveABI,
        functionName: "approve",
        args: [chain?.protocolContracts?.BandoRouterProxy, amountInUnits],
      });
    }

    // Agregar la transacción de solicitud de servicio
    transactions.push({
      to: chain?.protocolContracts?.BandoRouterProxy,
      abi: [requestERC20ServiceABI],
      functionName: "requestERC20Service",
      args: [serviceID, payload],
    });

    updateStep({
      message:
        transactions.length > 1
          ? "form.status.batchTransaction"
          : "form.status.signTransaction",
      type: "info",
      description: "form.status.wait",
    });

    try {
      const safeResponse = await sendBatchViaSafe(transactions);
      console.log("Safe batch transaction submitted:", safeResponse);

      return { success: true, isMultisig: true, safeResponse };
    } catch (error) {
      showNotification("error", "Error al enviar transacción batch");
      console.error("Error en batch transaction:", error);
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

        let result;
        if (token.key === nativeToken?.native_token.symbol) {
          result = await handleNativeTokenRequest({
            chain,
            account,
            quote,
            txId,
            serviceID,
            formattedChain,
          });
        } else {
          result = await handleERC20TokenRequest({
            chain,
            account,
            quote,
            txId,
            serviceID,
            token,
          });
        }

        if (!result.isMultisig) {
          clearStep();
        } else {
          showNotification("warning", "form.status.wait");
        }
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
    handleERC20BatchMultisig,
  };
};
