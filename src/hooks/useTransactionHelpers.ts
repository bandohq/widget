import { useState, useEffect } from "react";
import { defineChain } from "viem";
import { useWriteContract, useReadContract } from "wagmi";
import { transformToChainConfig } from "../utils/TransformToChainConfig";
import BandoRouter from "@bandohq/contract-abis/abis/BandoRouterV1.json";
import FulfillableRegistry from "@bandohq/contract-abis/abis/FulfillableRegistryV1.json";
import nativeTokenCatalog from "../utils/nativeTokenCatalog";

export const useTransactionHelpers = () => {
  const { writeContract } = useWriteContract();
  const [allowance, setAllowance] = useState<BigInt>(BigInt(0)); // Reactivity for allowance
  const [allowanceFetched, setAllowanceFetched] = useState<boolean>(false);
  const [isReferenceValid, setIsReferenceValid] = useState<boolean | null>(null); // Reactivity for isReferenceValid
  const [referenceFetched, setReferenceFetched] = useState<boolean>(false);

  const useCheckAllowance = (spenderAddress, tokenAddress, account, chain) => {
    const ERC20AllowanceABI = [
      {
        constant: true,
        inputs: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        type: "function",
      },
    ];

    const { data, isError, isLoading } = useReadContract({
      address: tokenAddress,
      abi: ERC20AllowanceABI,
      functionName: "allowance",
      args: [account?.address, spenderAddress],
      chainId: chain.id,
    });

    useEffect(() => {
      if (!isLoading && !isError && data) {
        setAllowance(BigInt(data as string));
        setAllowanceFetched(true);
      } else if (isError) {
        setAllowanceFetched(true);
      }
    }, [data, isError, isLoading]);
  };

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

      await writeContract({
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


  const useValidateReference = (chain, serviceID, referenceCode) => {
    const FulfillableRegistryABI = FulfillableRegistry.abi.find(
      (item) => item.name === "isRefValid"
    );

    const { data, isError, isLoading } = useReadContract({
      address: chain?.protocol_contracts?.FulfillableRegistry,
      abi: [FulfillableRegistryABI],
      functionName: "isRefValid",
      args: [serviceID, referenceCode],
      chainId: chain.id,
    });

    useEffect(() => {
      if (!isLoading && !isError && data !== undefined) {
        setIsReferenceValid(data as boolean);
        setReferenceFetched(true);
      } else if (isError) {
        setIsReferenceValid(false); // Marca como inválido si ocurre un error
        setReferenceFetched(true);
      }
    }, [data, isError, isLoading]);
  };

  const handleServiceRequest = async ({
    txId,
    chain,
    account,
    tokenKey,
    quote,
    product,
    quantity,
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

      useValidateReference(chain, serviceID, txId);

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

        await writeContract({
          address: chain?.protocol_contracts?.ERC20TokenRegistry,
          abi: [requestServiceABI],
          functionName: "requestService",
          args: [serviceID, payload],
          chain: formattedChain,
          account: account?.address,
        });
      } else {
        useCheckAllowance(
          chain?.protocol_contracts?.ERC20TokenRegistry,
          tokenKey,
          account,
          chain
        );

        if (!allowanceFetched) {
          console.log("Fetching allowance...");
          return;
        }

        if (BigInt(allowance as bigint) < requiredAmount) {
          await approveERC20(
            chain?.protocol_contracts?.ERC20TokenRegistry,
            requiredAmount,
            tokenKey,
            account,
            chain
          );
        }

        const requestERC20ServiceABI = BandoRouter.abi.find(
          (item) => item.name === "requestERC20Service"
        );

        const payload = {
          payer: account?.address,
          fiatAmount: quote?.fiat_amount,
          serviceRef: reference,
          token: tokenKey,
          tokenAmount: quote?.digital_asset_amount * quantity,
        };

        await writeContract({
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
