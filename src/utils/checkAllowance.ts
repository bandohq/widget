import { readContract } from "@wagmi/core";
import { ERC20AllowanceABI } from "../utils/abis";

export const checkAllowance = async (
  spenderAddress,
  tokenAddress,
  account,
  chain,
  config
) => {
  const maxAttempts = 5;
  const delay = 5000;
  let attempt = 0;
  let allowance = BigInt(0);

  while (attempt < maxAttempts) {
    try {
      attempt++;
      allowance = await readContract(config, {
        address: tokenAddress,
        abi: ERC20AllowanceABI,
        functionName: "allowance",
        args: [account?.address, spenderAddress],
        chainId: chain?.chain_id,
      }) as bigint;

      if (allowance > BigInt(0)) {
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
