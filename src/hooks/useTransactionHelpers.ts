import { useConfig } from "wagmi";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";
import { useState } from "react";
import { sendTransaction } from "@wagmi/core";
import { TransactionRequest } from "../providers/QuotesProvider/QuotesProvider";
import { useAccount } from "@lifi/wallet-management";
import { useChain } from "../hooks/useChain";
import { useTranslation } from "react-i18next";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import { useWorld } from "./useWorld";
import { getTxHashByReference, waitForReceipt } from "../utils/txUtils";
import { RetryPresets } from "../utils/retryUtils";
import Web3 from "web3";

export const useTransactionHelpers = () => {
  const [loading, setLoading] = useState(false);
  const config = useConfig();
  const { account } = useAccount();
  const { t } = useTranslation();
  const { isWorld, provider } = useWorld();
  const { chain } = useChain(isWorld ? 480 : account?.chainId);
  const { showNotification } = useNotificationContext();

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

    const payload = {
      reference,
      to,
      tokens: [
        {
          symbol: token?.symbol,
          token_amount: amount,
        },
      ],
      description,
    };

    try {
      const { finalPayload } = await provider?.commandsAsync.pay(payload);

      if (finalPayload.status === "success") {
        await new Promise((r) => setTimeout(r, 1500));

        const txHash = await getTxHashByReference(
          reference,
          to,
          chain?.rpcUrl,
          startBlock,
          {
            ...RetryPresets.blockchain,
            maxAttempts: 10,
            initialDelay: 1500,
            maxDelay: 20000,
            backoffMultiplier: 1.8,
          }
        );

        if (txHash) {
          // Optionally wait for transaction confirmation
          try {
            const isConfirmed = await waitForReceipt({
              rpc: chain?.rpcUrl,
              txHash,
              confirmations: 1,
              retryConfig: RetryPresets.receipt,
            });

            if (!isConfirmed) {
              console.warn("Transaction was found but failed to confirm");
            }
          } catch (error) {
            console.warn("Failed to wait for transaction confirmation:", error);
          }
        }

        return txHash;
      } else {
        console.error("Error at worldTransfer:", JSON.stringify(finalPayload));
        showNotification("error", t("error.title.transactionFailed"));
        throw new Error(`Payment failed: ${finalPayload.error_code}`);
      }
    } catch (error) {
      throw new Error("Error at worldTransfer", { cause: error });
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

  return {
    loading,
    signTransfer,
    worldTransfer,
  };
};
