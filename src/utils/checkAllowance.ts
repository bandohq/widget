import { readContract } from "@wagmi/core";
import { getPublicClient } from "wagmi/actions";
import { ERC20AllowanceABI } from "../utils/abis";

export const checkAllowance = async (
  spenderAddress,
  tokenAddress,
  account,
  chain,
  config,
  amount,
  approvalTxHash?: `0x${string}`
) => {
  const maxAttempts = 10;
  const delay = 5000;
  let attempt = 0;
  let allowance = BigInt(0);

  if (approvalTxHash) {
    try {
      const publicClient = getPublicClient(config);
      await publicClient.waitForTransactionReceipt({
        hash: approvalTxHash,
      });
    } catch (error) {
      console.error("Error waiting for approval transaction:", error);
      throw new Error("Failed to confirm approval transaction");
    }
  }

  while (attempt < maxAttempts) {
    try {
      attempt++;
      allowance = (await readContract(config, {
        address: tokenAddress,
        abi: ERC20AllowanceABI,
        functionName: "allowance",
        args: [account?.address, spenderAddress],
        chainId: chain?.chainId,
      })) as bigint;

      console.log(
        `Allowance check attempt ${attempt}:`,
        `Allowance: ${allowance.toString()}, Amount: ${amount.toString()}`
      );

      if (allowance >= amount) {
        break;
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`Error on attempt ${attempt}:`, error);
      if (attempt >= maxAttempts) {
        throw new Error("Allowance check failed after maximum attempts.");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return BigInt(allowance.toString());
};
