import { defineChain } from "viem";
import { useWriteContract, useReadContract } from "wagmi";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import FulfillableRegistry from "@bandohq/contract-abis/abis/FulfillableRegistryV1.json";
import nativeTokenCatalog from "../utils/nativeTokenCatalog";

export const useTransactionHelpers = () => {
  const { writeContract } = useWriteContract();

  const approveERC20 = async (
    spenderAddress,
    amount,
    tokenAddress,
    account,
    chain
  ) => {
    try {
      const ERC20ApproveABI = [
        {
          constant: false,
          inputs: [
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ name: "", type: "bool" }],
          type: "function",
        },
      ];

      writeContract({
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

  const validateReference = async (chain, serviceID, referenceCode) => {
    try {
      const FulfillableRegistryABI = FulfillableRegistry.abi.find(
        (item) => item.name === "isRefValid"
      );

      const isRefValid = useReadContract({
        address: chain?.protocol_contracts?.FulfillableRegistry,
        abi: [FulfillableRegistryABI],
        functionName: "isRefValid",
        args: [serviceID, referenceCode],
        chainId: chain.id,
      });

      if (!isRefValid) throw new Error("Invalid reference code");

      return true;
    } catch (error) {
      console.error("Reference validation failed:", error);
      throw error;
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
    reference,
  }) => {
    try {
      const serviceID = product?.evmServiceID;
      const nativeToken = nativeTokenCatalog.find(
        (item) => item.key === chain?.key
      );
      const formattedChain = defineChain(transformToChainConfig(chain, nativeToken));

      await validateReference(chain, serviceID, reference);

      if (tokenKey === nativeToken?.key) {
        const requestServiceABI = BandoRouter.abi.find(
          (item) => item.name === "requestService"
        );

        const payload = {
          payer: account?.address,
          fiatAmount: 1000,
          serviceRef: reference,
          token: tokenKey,
          tokenAmount: (quote?.digital_asset_amount * Math.pow(10, nativeToken.native_token.decimals)).toFixed(0),
        };

        writeContract({
          address: chain?.protocol_contracts?.ERC20TokenRegistry,
          abi: [requestServiceABI],
          functionName: "requestService",
          args: [serviceID, payload],
          chain: formattedChain,
          account: account?.address,
        });
      } else {
        const requestERC20ServiceABI = BandoRouter.abi.find(
          (item) => item.name === "requestERC20Service"
        );

        await approveERC20(
          chain?.protocol_contracts?.ERC20TokenRegistry,
          quantity,
          tokenKey,
          account,
          chain
        );

        const payload = {
          payer: account?.address,
          fiatAmount: quote?.fiat_amount,
          serviceRef: reference,
          token: tokenKey,
          tokenAmount: quote?.digital_asset_amount * quantity,
        };

        writeContract({
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
