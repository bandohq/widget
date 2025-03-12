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

  const handleServiceRequest = useCallback(async ({
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
      addStep({message: 'form.status.validatingReference', type:"loading"});

      const isReferenceValid = await validateReference(
        chain,
        serviceID,
        txId,
        config
      );

      updateStep({message: 'form.status.validatingReferenceCompleted', type:"completed"});
  
      if (!isReferenceValid) {
        showNotification("error", "Invalid reference code");
        clearStep();
        return;
      }

      if (token.key === nativeToken?.native_token.symbol) {
        const requestServiceABI = BandoRouter.abi.find(
          (item) => item.name === "requestService"
        );

        const weiAmount = parseUnits(quote?.digitalAssetAmount.toString(), token?.decimals);
        const value = parseUnits(quote?.totalAmount.toString(), token?.decimals);

        const payload = {
          payer: account?.address,
          fiatAmount: quote?.fiatAmount,
          serviceRef: txId,
          weiAmount
        };

        addStep({message: 'form.status.signTransaction', type:"info"});

        await writeContract(config,{
          value,
          address: chain?.protocolContracts?.BandoRouterProxy,
          abi: [requestServiceABI],
          functionName: "requestService",
          args: [serviceID, payload],
          chain: formattedChain,
          account: account?.address,
        });
        updateStep({message: 'form.status.signTransactionCompleted', type:"completed"});
      } else {
        addStep({message: 'form.status.aproveTokens', type:"info"});
        await approveERC20(
          chain?.protocolContracts?.BandoRouterProxy,
          parseUnits(quote?.totalAmount.toString(), token?.decimals),
          token.address,
          account,
          chain,
          config
        );
        updateStep({message:'form.status.validateAllowance', type:"loading"});
        await checkAllowance(
          chain?.protocolContracts?.BandoRouterProxy,
          token.address,
          account,
          chain,
          config,
          parseUnits(quote?.totalAmount.toString(), token?.decimals)
        );
        updateStep({message:'form.status.validateAllowanceCompleted', type:"completed"});
        
        const requestERC20ServiceABI = BandoRouter.abi.find(
          (item) => item.name === "requestERC20Service"
        );

        const payload = {
          payer: account?.address,
          fiatAmount: quote?.fiatAmount,
          serviceRef: txId,
          token: token.address,
          tokenAmount: parseUnits(quote?.digitalAssetAmount.toString(), token?.decimals),
        };

        addStep({message: 'form.status.signTransaction', type:"info"});

        await writeContract(config,{
          address: chain?.protocolContracts?.BandoRouterProxy,
          abi: [requestERC20ServiceABI],
          functionName: "requestERC20Service",
          args: [serviceID, payload],
          chain: chain.chainId,
          account: account?.address,      
        });
        updateStep({message: 'form.status.signTransactionCompleted', type:"completed"});
      }
      clearStep();
    } catch (error) {
      clearStep();
      showNotification("error", "Error in handleServiceRequest");
      console.error("Error in handleServiceRequest:", error);
      throw error;
    }
  }, [addStep, updateStep, clearStep, showNotification]);

  return {
    approveERC20,
    handleServiceRequest,
  };
};
