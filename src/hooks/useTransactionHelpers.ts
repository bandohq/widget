import { defineChain } from "viem";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import nativeTokenCatalog from "../utils/nativeTokenCatalog";
import { writeContract } from '@wagmi/core'
import {  ERC20ApproveABI } from "../utils/abis";
import { validateReference } from "../utils/validateReference";
import { useConfig } from "wagmi";
import { useNotificationContext } from "../providers/AlertProvider/NotificationProvider";
import { checkAllowance } from "../utils/checkAllowance";


export const useTransactionHelpers = () => {
  const config = useConfig();
  const {showNotification} = useNotificationContext();

  const approveERC20 = async (
    spenderAddress,
    amount,
    tokenAddress,
    account,
    chain,
    config
  ) => {
    try {
      await writeContract(config,{
        address: tokenAddress,
        abi: ERC20ApproveABI,
        functionName: "approve",
        args: [spenderAddress, amount],
        chain,
        account: account?.address,
      });

      return true;
    } catch (error) {
      showNotification("error", "Error on approving tokens, try later");
      console.error("Error on approving tokens:", error);
      return false;
    }
  };

  const handleServiceRequest = async ({
    txId,
    chain,
    account,
    quote,
    product,
    token
  }) => {
    try {
      const serviceID = product?.evmServiceId;
      const nativeToken = nativeTokenCatalog.find(
        (item) => item.key === chain?.key
      );

      const formattedChain = defineChain(transformToChainConfig(chain, nativeToken));

      const isReferenceValid = await validateReference(
        chain,
        serviceID,
        txId,
        config
      );
  
      if (!isReferenceValid) {
        showNotification("error", "Invalid reference code");
        return;
      }

      if (token.key === nativeToken?.native_token.symbol) {
        const requestServiceABI = BandoRouter.abi.find(
          (item) => item.name === "requestService"
        );

        const payload = {
          payer: account?.address,
          fiatAmount: 1000,
          serviceRef: txId,
          weiAmount: quote?.digital_asset_amount * (10 ** token?.decimals),
        };

        console.log("payload", payload);

        await writeContract(config,{
          address: chain?.protocol_contracts?.BandoRouterProxy,
          abi: [requestServiceABI],
          functionName: "requestService",
          args: [serviceID, payload],
          chain: formattedChain,
          account: account?.address,
        });
      } else {
        await approveERC20(
          chain?.protocol_contracts?.BandoRouterProxy,
          quote?.total_amount * (10 ** token?.decimals),
          token.address,
          account,
          chain,
          config
        );

        await checkAllowance(
          chain?.protocol_contracts?.BandoRouterProxy,
          token.address,
          account,
          chain,
          config
        );
        
        const requestERC20ServiceABI = BandoRouter.abi.find(
          (item) => item.name === "requestERC20Service"
        );

        const payload = {
          payer: account?.address,
          fiatAmount: quote?.fiat_amount,
          serviceRef: txId,
          token: token.address,
          tokenAmount: quote?.digital_asset_amount * (10 ** token?.decimals),
        };

        await writeContract(config,{
          address: chain?.protocol_contracts?.BandoRouterProxy,
          abi: [requestERC20ServiceABI],
          functionName: "requestERC20Service",
          args: [serviceID, payload],
          chain: chain.chain_id,
          account: account?.address,      
        });
      }
      
    } catch (error) {
      showNotification("error", "Error in handleServiceRequest");
      console.error("Error in handleServiceRequest:", error);
      throw error;
    }
  };

  return {
    approveERC20,
    handleServiceRequest,
  };
};
