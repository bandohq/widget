import { useAccount, useWalletMenu, type Account } from "@lifi/wallet-management";
import { FormKeyHelper } from "../stores/form/types";
import { useFieldValues } from "../stores/form/useFieldValues";
import { useChain } from "./useChain";
import { useFetch } from "./useFetch";
import { useNavigate } from "react-router-dom";
import { useWriteContract } from 'wagmi'
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import { useCountryContext } from "../stores/CountriesProvider/CountriesProvider";
import { useQuotes } from "../providers/QuotesProvider/QuotesProvider";

export const useTransactionFlow = (product) => {
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
  const { writeContract } = useWriteContract()

  const { account } = useAccount({
    chainType: chain?.network_type,
  });

 const signTransactionEvent = async () => {
  writeContract({ 
    abi: JSON.parse(BandoRouter),
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    functionName: 'requestERC20Service (0xe2f6ad25)',
    chain: chain,
    args: [
      product?.
    ]
 })

  
    return null;
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
    await signTransactionEvent();
  };

  return {
    handleTransaction,
    isPending,
  };
};


