import { useConfig } from "wagmi";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";
import { useState } from "react";
import { sendTransaction } from "@wagmi/core";
import { TransactionRequest } from "../providers/QuotesProvider/QuotesProvider";
import { useAccount } from "@lifi/wallet-management";
import { useChain } from "../hooks/useChain";
import { useTranslation } from "react-i18next";
import { transformToChainConfig } from "../utils/TransformToChainConfig";

export const useTransactionHelpers = () => {
  const [loading, setLoading] = useState(false);
  const config = useConfig();
  const { account } = useAccount();
  const { t } = useTranslation();
  const { chain } = useChain(account?.chainId);
  const { showNotification } = useNotificationContext();

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

  return {
    loading,
    signTransfer,
  };
};