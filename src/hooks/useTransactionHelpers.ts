import { erc20Abi, parseEther, parseUnits } from "viem";
import { writeContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";
import { useState } from "react";
import { sendTransaction } from "@wagmi/core";
import { TransactionRequest } from "../providers/QuotesProvider/QuotesProvider";
import { Address } from "../pages/SelectChainPage/types";
import { useAccount } from "@lifi/wallet-management";
import { useToken } from "../hooks/useToken";
import { useChain } from "../hooks/useChain";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useTranslation } from "react-i18next";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import { useQuotes } from "../providers/QuotesProvider/QuotesProvider";

export const useTransactionHelpers = () => {
  const [loading, setLoading] = useState(false);
  const config = useConfig();
  const { account } = useAccount();
  const { t } = useTranslation();
  const { quote } = useQuotes();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const [tokenAddress] = useFieldValues(tokenKey);
  const { chain } = useChain(account?.chainId);
  const { token } = useToken(chain, tokenAddress);
  const { showNotification } = useNotificationContext();

  const transferNativeToken = async (
    transactionRequest: TransactionRequest
  ) => {
    try {
      if (!chain) throw new Error("Chain not found");

      const configChain = transformToChainConfig(chain, chain.nativeToken);
      const txHash = await sendTransaction(config, {
        to: transactionRequest.to,
        value: BigInt(transactionRequest.value),
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
      console.error("Error at transferNativeToken:", error);
      throw error;
    }
  };

  const transferErc20Token = async (transactionRequest: TransactionRequest) => {
    try {
      if (!chain) throw new Error("Chain not found");

      const configChain = transformToChainConfig(chain, chain.nativeToken);
      const txHash = await writeContract(config, {
        address: token.address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [
          transactionRequest.to as Address,
          parseUnits(quote?.totalAmount, token.decimals),
        ],
        chain: configChain,
        account: account?.address as Address,
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

  return {
    loading,
    signTransfer,
  };
};
function useQuote(): { quote: any } {
  throw new Error("Function not implemented.");
}

