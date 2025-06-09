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
import { MiniKit, PayCommandInput } from "@worldcoin/minikit-js";

export const useTransactionHelpers = () => {
  const [loading, setLoading] = useState(false);
  const config = useConfig();
  const { account } = useAccount();
  const { t } = useTranslation();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const [tokenAddress] = useFieldValues(tokenKey);
  const { chain } = useChain(account?.chainId);
  const { token } = useToken(chain, tokenAddress);
  const { showNotification } = useNotificationContext();

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

  const WorldTransfer = async (
    transactionRequest: TransactionRequest,
    txId: string
  ) => {
    const payload: PayCommandInput = {
      reference: txId,
      tokens: [
        {
          symbol: token.symbol,
          token_amount: transactionRequest.value,
        },
      ],
      description: "Bando Widget",
      to: transactionRequest.to,
    };

    const { finalPayload } = await MiniKit.commandsAsync.pay(payload);
    if (finalPayload.status == "success") {
      const res = await fetch(`/api/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });
      const payment = await res.json();
      if (payment.success) {
        return payment.txHash;
      }
    }
  };

  const signTransfer = async (
    transactionRequest: TransactionRequest,
    txId: string
  ) => {
    setLoading(true);
    try {
      const nativeToken = chain?.nativeToken;

      if (MiniKit.isInstalled()) {
        return await WorldTransfer(transactionRequest, txId);
      }

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
