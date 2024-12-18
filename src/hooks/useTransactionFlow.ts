import { useEffect, useState } from "react";
import { useAccount, useWalletMenu, type Account } from "@lifi/wallet-management";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useChain } from "./useChain";
import { useToken } from "./useToken";
import { useFetch } from "./useFetch";
import { useNavigate } from "react-router-dom";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import { Buffer } from "buffer";
import { useCountryContext } from "../stores/CountriesProvider/CountriesProvider";
import { useQuotes } from "../providers/QuotesProvider/QuotesProvider";

export const useTransactionFlow = (product) => {
  const [transactionId, setTransactionId] = useState(null);
  const navigate = useNavigate();
  const { openWalletMenu } = useWalletMenu();
  const tokenKey = FormKeyHelper.getTokenKey("from");
  const { quote } = useQuotes();
  const [chainId, tokenAddress, quantity, reference] = useFieldValues(
    FormKeyHelper.getChainKey("from"),
    tokenKey,
    "quantity",
    "reference"
  );
  const { country} = useCountryContext();
  const { chain } = useChain(chainId);
  const { token } = useToken(chain, tokenAddress);

  const { account } = useAccount({
    chainType: chain?.network_type,
  });

  const signTransactionMessage = async ({ txId, account, openWalletMenu, to, value, chainId }: {to: `0x${string}`, value: bigint, chainId: number, txId?: string, account: Account, openWalletMenu: () => void}) => {
    try {
      if (account.chainType !== 'EVM') {
        throw new Error('Only EVM accounts are supported for signing in this flow.');
      }
  
      const connector = account.connector;
      if (!connector) {
        throw new Error('Connector is not available for the EVM account.');
      }
  
      const provider = await connector.getProvider();
  
      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(provider),
      });

      const request = await walletClient.prepareTransactionRequest({
        to,
        value,
        chainId,
        data: txId ? `0x${Buffer.from(txId).toString('hex')}` : undefined,
      });
  
      const transaction = {
        to,
        value:value,
        chainId,
        data: txId ? `0x${Buffer.from(txId).toString('hex')}` : undefined,
      };
  
      const signature = await walletClient.signTransaction({
        transaction,
        account: account.address as `0x${string}`,
        chain: chainId,
      });
  
      console.log("Generated signature:", signature);
      return signature;
    } catch (error) {
      console.error("Error signing the transaction:", error);
      openWalletMenu();
      throw error;
    }
  };

  const { mutate, isPending } = useFetch({
    url: "references/",
    method: "POST",
    data: {
      reference: product?.referenceType[0]?.name === "phone" ? `${country?.calling_code}${reference}` : reference,
      transaction_intent: {
        sku: product?.sku,
        chain: chain?.key,
        token: quote?.digital_asset,
        quantity,
        amount: quote?.digital_asset_amount * quantity,
        wallet: account?.address,
      },
    },
    mutationOptions: {
      onSuccess: async (data) => {
        const txId = data.transaction_intents?.transaction_id;
        if (txId) {
          setTransactionId(txId);

          try {
            const signature = await signTransactionMessage({
              txId,
              account,
              openWalletMenu,
              to: "0xRecipientAddress",
              value: product?.price?.stableCoinValue,
              chainId: chain?.chain_id,
            });

            navigate(`/status/${txId}`, {
              state: { signature },
            });

            console.log("Transaction ID:", txId);
          } catch (error) {
            console.error("Error handling the transaction signature:", error);
          }
        }
      },
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
    },
  });

  const handleTransaction =async () => {
    mutate();

    // console.log("Generated signature:", signature);
  };

  return {
    handleTransaction,
    isPending,
  };
};
