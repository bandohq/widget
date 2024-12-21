import { useAccount, useWalletMenu, type Account } from "@lifi/wallet-management";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useChain } from "./useChain";
import { useFetch } from "./useFetch";
import { useNavigate } from "react-router-dom";
import { useWriteContract } from 'wagmi'
import { useCountryContext } from "../stores/CountriesProvider/CountriesProvider";
import { useQuotes } from "../providers/QuotesProvider/QuotesProvider";
import { useProduct } from "../stores/ProductProvider/ProductProvider";
import BandoRouterV1 from "@bandohq/contract-abis/abis/BandoRouterV1.json"
import { Adress } from "../pages/SelectChainPage/types";

export const useTransactionFlow = () => {
  const navigate = useNavigate();
  const { product } = useProduct();
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
  const { writeContract } = useWriteContract()

  const { account } = useAccount({
    chainType: chain?.network_type,
  });

  const signTransactionEvent = async () => {
    try {
      const requestERC20ServiceABI = BandoRouterV1.abi.find(
        (item) => item.name === "requestERC20Service"
      );
  
      const serviceID = 1;
      const requestPayload = {
        payer: account?.address,
        fiatAmount: 1000, 
        serviceRef: "service123",
        token: tokenAddress,
        tokenAmount: quantity,
      };
  
      console.log("Preparing transaction with payload:", {
        serviceID,
        request: requestPayload,
      });
  
      const transaction = writeContract({
        address: chain?.protocol_contracts?.ERC20TokenRegistry,
        abi: [requestERC20ServiceABI],
        functionName: "requestERC20Service",
        args: [serviceID, requestPayload],
        chain: undefined,
        account: account?.address as Adress
      });
  
      console.log("Transaction initiated:", transaction);
      //TODO: redirect to the status page
      return null;
    } catch (error) {
      console.error("Error in signTransactionEvent:", error);
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
          try {
            const signature = await signTransactionEvent();

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
    // mutate();
    console.log("handleTransaction");
    await signTransactionEvent();
  };

  return {
    handleTransaction,
    isPending,
  };
};


