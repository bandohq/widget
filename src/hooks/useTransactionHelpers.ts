import { defineChain } from "viem";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import nativeTokenCatalog from "../utils/nativeTokenCatalog";
import { writeContract } from '@wagmi/core'
import {  ERC20ApproveABI } from "../utils/abis";
import { validateReference } from "../utils/validateReference";
import { checkAllowance } from "../utils/checkAllowance";


export const useTransactionHelpers = () => {

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

      console.log(`Approved ${amount} tokens for ${spenderAddress}`);
      return true;
    } catch (error) {
      console.error("Error on approving tokens:", error);
      return false;
    }
  };
  const handleServiceRequest = async ({
    txId,
    chain,
    account,
    tokenKey,
    quote,
    product,
    quantity,
    config
  }) => {
    try {
      const serviceID = product?.evmServiceId;
      const nativeToken = nativeTokenCatalog.find(
        (item) => item.key === chain?.key
      );
      const requiredAmount = BigInt(
        (quote?.digital_asset_amount * quantity).toFixed(0)
      );
      const formattedChain = defineChain(transformToChainConfig(chain, nativeToken));

      const isReferenceValid = await validateReference(
        chain,
        serviceID,
        txId,
        config
      );
  
      if (!isReferenceValid) {
        console.error("Invalid reference code");
        return;
      }

      if (tokenKey === nativeToken?.key) {
        const requestServiceABI = BandoRouter.abi.find(
          (item) => item.name === "requestService"
        );

        const payload = {
          payer: account?.address,
          fiatAmount: 1000,
          serviceRef: txId,
          token: tokenKey,
          tokenAmount: (
            quote?.digital_asset_amount *
            Math.pow(10, nativeToken.native_token.decimals)
          ).toFixed(0),
        };

        await writeContract(config,{
          address: chain?.protocol_contracts?.ERC20TokenRegistry,
          abi: [requestServiceABI],
          functionName: "requestService",
          args: [serviceID, payload],
          chain: formattedChain,
          account: account?.address,
        });
      } else {
        const allowance = await checkAllowance(
          chain?.protocol_contracts?.ERC20TokenRegistry,
          tokenKey,
          account,
          chain,
          config
        );
  
        if (allowance < requiredAmount) {
          await approveERC20(
            chain?.protocol_contracts?.ERC20TokenRegistry,
            requiredAmount,
            tokenKey,
            account,
            chain,
            config
          );
        }

        const requestERC20ServiceABI = BandoRouter.abi.find(
          (item) => item.name === "requestERC20Service"
        );

        const payload = {
          payer: account?.address,
          fiatAmount: quote?.fiat_amount,
          serviceRef: product?.reference,
          token: tokenKey,
          tokenAmount: quote?.digital_asset_amount * quantity,
        };

        await writeContract(config,{
          address: chain?.protocol_contracts?.ERC20TokenRegistry,
          abi: [requestERC20ServiceABI],
          functionName: "requestERC20Service",
          args: [serviceID, payload],
          chain: formattedChain,
          account: account?.address,      
        });
      }

      console.log("Transaction completed successfully");
    } catch (error) {
      console.error("Error in handleServiceRequest:", error);
      throw error;
    }
  };

  return {
    approveERC20,
    handleServiceRequest,
  };
};
